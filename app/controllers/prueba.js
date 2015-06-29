/* NOTE: This code has been updated from the one found at SO.
 *
 * Old : http://jsfiddle.net/kimiliini/HM4rW/10
 */
function DataEnc(a) {
    this.config(a);
}
/*
* http://www.iana.org/assignments/character-sets/character-sets.xhtml
* */
DataEnc._enctype = {
        u8    : ['u8', 'utf8'],
        // RFC-2781, Big endian should be presumed if none given
        u16be : ['u16', 'u16be', 'utf16', 'utf16be', 'ucs2', 'ucs2be'],
        u16le : ['u16le', 'utf16le', 'ucs2le']
};
DataEnc._BOM = {
        'none'     : '',
        'UTF-8'    : '%ef%bb%bf', // Discouraged
        'UTF-16BE' : '%fe%ff',
        'UTF-16LE' : '%ff%fe'
};
DataEnc.prototype = {
    // Basic setup
    config : function(a) {
        var opt = {
            charset: 'u8',
            mime   : 'text/csv',
            base64 : 0,
            bom    : 0
        }, p;
        a = a || {};
        for (p in opt) {
            if (opt.hasOwnProperty(p))   
                this[p] = a.hasOwnProperty(p) ? a[p] : opt[p];
        }
        this.buf  = '';
        this.lead = '';
        this.__intro();
        return this;
    },
    // Create lead based on config
    // data:[<MIME-type>][;charset=<encoding>][;base64],<data>
    __intro : function() {
        var
            g = [],
            c = this.charset || '',
            b = 'none'
        ;
        if (this.mime && this.mime !== '')
            g.push(this.mime);
        if (c !== '') {
            c = c.replace(/[-\s]/g, '').toLowerCase();
            if (DataEnc._enctype.u8.indexOf(c) > -1) {
                c = 'UTF-8';
                if (this.bom)
                    b = c;
                this.enc = this.utf8;
            } else if (DataEnc._enctype.u16be.indexOf(c) > -1) {
                c = 'UTF-16BE';
                if (this.bom)
                    b = c;
                this.enc = this.utf16be;
            } else if (DataEnc._enctype.u16le.indexOf(c) > -1) {
                c = 'UTF-16LE';
                if (this.bom)
                    b = c;
                this.enc = this.utf16le;
            } else {
                if (c === 'copy')
                    c = '';
                this.enc = this.copy;
            }
        }
        if (c !== '')
            g.push('charset=' + c);
        if (this.base64)
            g.push('base64');
        this.lead = 'data:' + g.join(';') + ',' + DataEnc._BOM[b];
        return this;
    },
    // Deliver
    pay : function() {
        return this.lead + this.buf;
    },
    // UTF-16BE
    utf16be : function(t) { // U+0500 => %05%00
        var i, c, buf = [];
        for (i = 0; i < t.length; ++i) {
            if ((c = t.charCodeAt(i)) > 0xff) {
                buf.push(('0' + (c >> 0x08).toString(16)).substr(-2));
                buf.push(('0' + (c  & 0xff).toString(16)).substr(-2));
            } else {
                buf.push('00');
                buf.push(('0' + (c  & 0xff).toString(16)).substr(-2));
            }
        }
        this.buf += '%' + buf.join('%');
        // Note the hex array is returned, not string with '%'
        // Might be useful if one want to loop over the data.
        return buf;
    },
    // UTF-16LE
    utf16le : function(t) { // U+0500 => %00%05
        var i, c, buf = [];
        for (i = 0; i < t.length; ++i) {
            if ((c = t.charCodeAt(i)) > 0xff) {
                buf.push(('0' + (c  & 0xff).toString(16)).substr(-2));
                buf.push(('0' + (c >> 0x08).toString(16)).substr(-2));
            } else {
                buf.push(('0' + (c  & 0xff).toString(16)).substr(-2));
                buf.push('00');
            }
        }
        this.buf += '%' + buf.join('%');
        // Note the hex array is returned, not string with '%'
        // Might be useful if one want to loop over the data.
        return buf;
    },
    // UTF-8
    utf8 : function(t) {
        this.buf += encodeURIComponent(t);
        return this;
    },
    // Direct copy
    copy : function(t) {
        this.buf += t;
        return this;
    }
};


/* ----------------------------------------------------------------------------
 *
 *
 * Test code
 *
 *
 * ------------------------------------------------------------------------- */



// DOM Helper for test
function elem(s) {
    return document.getElementById(s);
}

function downloadCsv() {
    var mime = elem('mime').value,
        // Line ending
        eol = {lf: '\n', crlf: '\r\n', cr:'\r', lfcr:'\n\r'}[elem('eol').value],
        delim = elem('tab').checked ? '\t' : ',',
        data = [
            ['name', 'city', 'state'],
            ['\u0500\u05E1\u0E01\u1054', 'seattle', 'washington'],
            ['hola', 'hopla', 'dopla']
        ], i,
        len = data.length,
        encoder, encodedURI
    ;
    // Initialize new encoder
    encoder = new DataEnc({
        mime   : elem('mime').value,
        charset: elem('charset').value,
        bom    : elem('bom').checked
    });

    if (0) { // Using input from <textarea>
        for (i = 0; i < len; ++i) {
            encoder.enc(data[i].join(',') + (i < len - 1 ? eol : ''));
        }
    } else {
        // Get data from textarea and split on newlines
        // Encode.
        data = document.getElementById('in').value;
        if (delim === '\t')
            data = data.replace(/,/g, '\t');
        data = data.split(/[\r\n]/g);
        len = data.length;
        for (i = 0; i < len; ++i) {
            encoder.enc(data[i] + (i < len - 1 ? eol : ''));
        }
    }
    // Display escaped string in textarea
    elem('out').value = (encoder.lead + '\n' +
                         encoder.buf.replace(/(.{78})/g, '$1\n\n')
    );

    // If not "download" button
    if (this.id === 'go')
        return;

    // Get payed
    encodedURI = encoder.pay();
    if (elem('method').value === 'window.open') {
        window.open(encodedURI);
    } else {
        var ext = (mime === 'text/csv' ? 'csv' : 'txt');
        var link = document.createElement('a');
        link.setAttribute('href', encodedURI);
        link.setAttribute('download', 'my_data.' + ext);
        link.setAttribute('target', '_new');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        link = null;
    }
}

// Load
// JSFiddle does not like this
document.addEventListener("DOMContentLoaded", function () {
    elem('go').onclick = downloadCsv;
    elem('down').onclick = downloadCsv;
});