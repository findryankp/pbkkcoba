/*
SQLyog Ultimate v8.6 Beta2
MySQL - 5.5.5-10.1.29-MariaDB : Database - safario
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`safario` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `safario`;

/*Table structure for table `absen` */

DROP TABLE IF EXISTS `absen`;

CREATE TABLE `absen` (
  `id_absen` varchar(10) NOT NULL,
  `id_user` varchar(10) NOT NULL,
  `id_matkul` varchar(10) NOT NULL,
  `waktu_absen` datetime NOT NULL,
  `status` char(1) NOT NULL,
  PRIMARY KEY (`id_absen`),
  KEY `FK_absen` (`id_user`),
  KEY `FK_absen1` (`id_matkul`),
  CONSTRAINT `FK_absen` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_absen1` FOREIGN KEY (`id_matkul`) REFERENCES `matkul` (`id_matkul`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `absen` */

/*Table structure for table `matkul` */

DROP TABLE IF EXISTS `matkul`;

CREATE TABLE `matkul` (
  `id_matkul` varchar(10) NOT NULL,
  `id_user` varchar(10) NOT NULL,
  `nama` varchar(30) NOT NULL,
  `ruang` varchar(10) NOT NULL,
  `hari` varchar(15) NOT NULL,
  `waktu_awal` time NOT NULL,
  `waktu_akhir` time NOT NULL,
  PRIMARY KEY (`id_matkul`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `matkul` */

insert  into `matkul`(`id_matkul`,`id_user`,`nama`,`ruang`,`hari`,`waktu_awal`,`waktu_akhir`) values ('0001','0003','PBKK G','IF 107a','Senin','10:00:00','12:30:00'),('0002','0003','PBKK H','IF 103','Selasa','10:00:00','12:30:00');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id_user` varchar(10) NOT NULL,
  `username` varchar(20) NOT NULL,
  `nama` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL,
  `angkatan` varchar(10) DEFAULT NULL,
  `role_user` char(1) NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `user` */

insert  into `user`(`id_user`,`username`,`nama`,`password`,`angkatan`,`role_user`) values ('0001','5115100035','Findryan Kurniawan Pradanawan','123456','2015','2'),('0002','5115100022','Huda Prasetia Nugraha','huda123','2015','2'),('0003','123456','Ridho Rahman H.','123456','','1'),('0004','5115100073','Fatimatus Zulfa','zulfa123','2015','2');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
