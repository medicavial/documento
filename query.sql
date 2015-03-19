CREATE TABLE `TicketPagos` (
  `TPA_clave` int(11) NOT NULL AUTOINCREMNT,
  `TCP_clave` int(11) NOT NULL,
  `TCS_clave` int(11) NOT NULL,
  `TSP_clave` int(11) NOT NULL,
  `TPA_etapa` int(11) NOT NULL,
  `Uni_clave` int(11) NOT NULL,
  `Cia_clave` int(11) NOT NULL,
  `Exp_folio` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `TPA_obs` longtext COLLATE utf8_unicode_ci NOT NULL,
  `TPA_asignado` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `TPA_asignadofecha` datetime NOT NULL,
  `TPA_fechareg` datetime NOT NULL,
  `TPA_fechaactualizacion` datetime NOT NULL,
  `Usu_registro` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `Usu_actualiza` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`TPA_clave`),
  KEY `TPA_clave` (`TPA_clave`),
  KEY `Exp_folio` (`Exp_folio`)
) 

CREATE TABLE `TicketStatusPagos` (
  `TSP_clave` int(11) NOT NULL AUTO_INCREMENT,
  `TSP_nombre` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`TSP_clave`),
  KEY `TSP_clave` (`TSP_clave`)
) 

CREATE TABLE `TicketSubcatPagos` (
  `TSub_clave` int(11) NOT NULL AUTO_INCREMENT,
  `TCat_clave` int(11) NOT NULL,
  `TSub_nombre` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`TSub_clave`),
  KEY `TCat_clave` (`TCat_clave`),
  KEY `TSub_clave` (`TSub_clave`)
)

CREATE TABLE `TicketCatPagos` (
  `TCP_clave` int(11) NOT NULL AUTO_INCREMENT,
  `TCP_nombre` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`TCP_clave`),
  KEY `TCP_clave` (`TCP_clave`)
)



select count(Exp_folio) as folios, cia_nombre as Cliente from Expediente
inner join Unidad on Unidad.Uni_clave = Expediente.Uni_clave
inner join Compania on Compania.Cia_clave = Expediente.Cia_clave
where Expediente.Uni_clave = 185 and Exp_cancelado = 0 and Exp_fecreg between '2015-01-01' and '2015-03-19' group by Cia_nombre

