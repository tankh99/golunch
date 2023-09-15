-- MySQL dump 10.13  Distrib 8.0.15, for macos10.14 (x86_64)
--
-- Host: localhost    Database: golunch
-- ------------------------------------------------------
-- Server version	8.0.15

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'User'),(2,'Admin'),(3,'Owner');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopRewards`
--

DROP TABLE IF EXISTS `shopRewards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `shopRewards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `shopID` int(11) NOT NULL,
  `distance` decimal(11,2) DEFAULT NULL,
  `isDeleted` bit(1) DEFAULT b'0',
  PRIMARY KEY (`id`),
  KEY `shopReward_shopID_idx` (`shopID`),
  CONSTRAINT `shopReward_shopID` FOREIGN KEY (`shopID`) REFERENCES `shops` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopRewards`
--

LOCK TABLES `shopRewards` WRITE;
/*!40000 ALTER TABLE `shopRewards` DISABLE KEYS */;
INSERT INTO `shopRewards` VALUES (57,'Basic Reward','Not really much special. Just a sticker or stamp',49,10.00,_binary '\0'),(63,'My Foot','Eat my foot fungus',48,1.00,_binary ''),(64,'Escargot lunch','Wow, escargots for walking 5km? What a steal!',48,5.00,_binary ''),(65,'Fruits','Fresh fruits for your wonderful body\'s needs',48,5.00,_binary '\0'),(66,'Big Fruits','Big fruits like durians, pumpkins and melons',48,20.00,_binary '\0'),(77,'Drinks','Free coke/tea',1,10.00,_binary '\0'),(78,'Free Lunch','Of any item in our menu. What a steal!',1,42.00,_binary '\0'),(79,'Appetizers','Salad or mashed potatoes',1,22.00,_binary '\0'),(89,'Appetizers','Sweet sweet treats',1,22.00,_binary ''),(96,'asdasd','',63,12.00,_binary '\0'),(97,'Drinks','Drinks',64,10.00,_binary '\0'),(98,'Appetizers','Mashed potatoes or salad',64,22.00,_binary '\0'),(99,'Free Lunch','Free lunch off of our entire menu',64,42.00,_binary '\0');
/*!40000 ALTER TABLE `shopRewards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shops`
--

DROP TABLE IF EXISTS `shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `shops` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `officeNumber` varchar(50) DEFAULT NULL,
  `imageUrl` varchar(1000) DEFAULT NULL,
  `isPromoted` tinyint(1) DEFAULT NULL,
  `accessToken` varchar(1000) DEFAULT NULL,
  `lat` decimal(10,8) DEFAULT NULL,
  `lng` decimal(11,8) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shops`
--

LOCK TABLES `shops` WRITE;
/*!40000 ALTER TABLE `shops` DISABLE KEYS */;
INSERT INTO `shops` VALUES (1,'FC6','Singapore Polytechnic, 500 Dover Rd','06:00:00','17:00:00','63425991','images/shops/FC6-imageUrl.jpg',1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjJmMTgwYTBkLWExYWMtNTIxYy04NDNlLWJhMGI4NTFmM2MyOCIsImlhdCI6MTU2MzI2NjMyMCwiZXhwIjoxNTYzMzUyNzIwfQ.zLkR4X3TPVOEvCs322_e3XF99y2qdmXZKA5ItLHEGXw',NULL,NULL),(64,'kupittaan paviljonki','Pyhän Henrikin aukio, Kupittaankatu 8, 20520 Turku, Finland','10:30:00','03:00:00','+358 2 2535808','images/shops/kupittaanpaviljonki-imageUrl.jpg',1,'',NULL,NULL);
/*!40000 ALTER TABLE `shops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userHistory`
--

DROP TABLE IF EXISTS `userHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `userHistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT NULL,
  `userID` int(11) NOT NULL,
  `startTime` datetime DEFAULT NULL,
  `endTime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userHistory_userID_idx` (`userID`),
  CONSTRAINT `userHistory_userID` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=443 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userHistory`
--

LOCK TABLES `userHistory` WRITE;
/*!40000 ALTER TABLE `userHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `userHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userRewards`
--

DROP TABLE IF EXISTS `userRewards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `userRewards` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `rewardID` int(11) NOT NULL,
  `dateTime` datetime NOT NULL,
  `isClaimed` bit(1) DEFAULT b'0',
  PRIMARY KEY (`ID`),
  KEY `userRewards_userID_idx` (`userID`),
  KEY `userRewards_rewardID_idx` (`rewardID`),
  CONSTRAINT `userRewards_rewardID` FOREIGN KEY (`rewardID`) REFERENCES `shoprewards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userRewards_userID` FOREIGN KEY (`userID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userRewards`
--

LOCK TABLES `userRewards` WRITE;
/*!40000 ALTER TABLE `userRewards` DISABLE KEYS */;
/*!40000 ALTER TABLE `userRewards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `email` varchar(100) NOT NULL,
  `roleID` int(11) NOT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `accumulatedDistance` decimal(11,2) NOT NULL DEFAULT '0.00',
  `totalDistance` decimal(11,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  KEY `roleID_idx` (`roleID`),
  CONSTRAINT `roleID` FOREIGN KEY (`roleID`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (52,'User','$2b$10$yxesx.6eO4H.kqJ0COkxtuaxTx8FITfQuqz30DuYPJh0vpun0lIW2','user@gmail.com',1,'Tan',300.00,300.00),(53,'Store','$2b$10$d/LHpYRZYascDyxi9QeF3.u2xe.E5dwOCitXo6fvMBYZeXnDXTac.','Store@gmail.com',2,'',0.00,0.00),(74,'test','$2b$10$BQ20f3u/aJezpIRT6Tnz/eG5Q146p/iXiZVUP6sKIy7fU.VjtlPvG','test@gmail.com',1,'',0.00,0.00);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-01 12:14:30
