module.exports = "DROP TABLE IF EXISTS `meal`;\n" +
    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
    "/*!40101 SET character_set_client = utf8 */;\n" +
    "CREATE TABLE `meal` (\n" +
    "  `id` int NOT NULL AUTO_INCREMENT,\n" +
    "  `isActive` tinyint NOT NULL DEFAULT '0',\n" +
    "  `isVega` tinyint NOT NULL DEFAULT '0',\n" +
    "  `isVegan` tinyint NOT NULL DEFAULT '0',\n" +
    "  `isToTakeHome` tinyint NOT NULL DEFAULT '1',\n" +
    "  `dateTime` datetime NOT NULL,\n" +
    "  `maxAmountOfParticipants` int NOT NULL DEFAULT '6',\n" +
    "  `price` decimal(5,2) NOT NULL,\n" +
    "  `imageUrl` varchar(255) NOT NULL,\n" +
    "  `cookId` int DEFAULT NULL,\n" +
    "  `createDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),\n" +
    "  `updateDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),\n" +
    "  `name` varchar(200) NOT NULL,\n" +
    "  `description` varchar(400) NOT NULL,\n" +
    "  `allergenes` set('gluten','lactose','noten') NOT NULL DEFAULT '',\n" +
    "  PRIMARY KEY (`id`),\n" +
    "  KEY `FK_e325266e1b4188f981a00677580` (`cookId`),\n" +
    "  CONSTRAINT `FK_e325266e1b4188f981a00677580` FOREIGN KEY (`cookId`) REFERENCES `user` (`id`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;\n" +
    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
    "\n" +
    "--\n" +
    "-- Dumping data for table `meal`\n" +
    "--\n" +
    "\n" +
    "LOCK TABLES `meal` WRITE;\n" +
    "/*!40000 ALTER TABLE `meal` DISABLE KEYS */;\n" +
    "INSERT INTO `meal` VALUES \n" +
    "(1,1,0,0,1,'2022-03-22 17:35:00',4,12.75,'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',1,'2022-02-26 18:12:40.048998','2022-04-26 12:33:51.000000','Pasta Bolognese met tomaat, spekjes en kaas','Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!','gluten,lactose'),\n" +
    "(2,1,1,0,0,'2022-05-22 13:35:00',4,12.75,'https://static.ah.nl/static/recepten/img_RAM_PRD159322_1024x748_JPG.jpg',2,'2022-02-26 18:12:40.048998','2022-04-25 12:56:05.000000','Aubergine uit de oven met feta, muntrijst en tomatensaus','Door aubergines in de oven te roosteren worden ze heerlijk zacht. De balsamico maakt ze heerlijk zoet.','noten'),\n" +
    "(3,1,0,0,1,'2022-05-22 17:30:00',4,10.75,'https://static.ah.nl/static/recepten/img_099918_1024x748_JPG.jpg',2,'2022-02-26 18:12:40.048998','2022-03-15 14:10:19.000000','Spaghetti met tapenadekip uit de oven en frisse salade','Perfect voor doordeweeks, maar ook voor gasten tijdens een feestelijk avondje.','gluten,lactose'),\n" +
    "(4,1,0,0,0,'2022-03-26 21:22:26',4,4.00,'https://static.ah.nl/static/recepten/img_063387_890x594_JPG.jpg',3,'2022-03-06 21:23:45.419085','2022-03-12 19:51:57.000000','Zuurkool met spekjes','Heerlijke zuurkoolschotel, dé winterkost bij uitstek. ',''),\n" +
    "(5,1,1,0,1,'2022-03-26 21:24:46',6,6.75,'https://www.kikkoman.nl/fileadmin/_processed_/5/7/csm_WEB_Bonte_groenteschotel_6851203953.jpg',3,'2022-03-06 21:26:33.048938','2022-03-12 19:50:13.000000','Groentenschotel uit de oven','Misschien wel de lekkerste schotel uit de oven! En vol vitaminen! Dat wordt smikkelen. Als je van groenten houdt ben je van harte welkom. Wel eerst even aanmelden.','');\n" +
    "/*!40000 ALTER TABLE `meal` ENABLE KEYS */;\n" +
    "UNLOCK TABLES;\n" +
    "\n" +
    "--\n" +
    "-- Table structure for table `meal_participants_user`\n" +
    "--\n" +
    "\n" +
    "DROP TABLE IF EXISTS `meal_participants_user`;\n" +
    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
    "/*!40101 SET character_set_client = utf8 */;\n" +
    "CREATE TABLE `meal_participants_user` (\n" +
    "  `mealId` int NOT NULL,\n" +
    "  `userId` int NOT NULL,\n" +
    "  PRIMARY KEY (`mealId`,`userId`),\n" +
    "  KEY `IDX_726a90e82859401ab88867dec7` (`mealId`),\n" +
    "  KEY `IDX_6d0a7d816bf85b634a3c6a83ac` (`userId`),\n" +
    "  CONSTRAINT `FK_6d0a7d816bf85b634a3c6a83aca` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,\n" +
    "  CONSTRAINT `FK_726a90e82859401ab88867dec7f` FOREIGN KEY (`mealId`) REFERENCES `meal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE\n" +
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;\n" +
    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
    "\n" +
    "--\n" +
    "-- Dumping data for table `meal_participants_user`\n" +
    "--\n" +
    "\n" +
    "LOCK TABLES `meal_participants_user` WRITE;\n" +
    "/*!40000 ALTER TABLE `meal_participants_user` DISABLE KEYS */;\n" +
    "INSERT INTO `meal_participants_user` VALUES \n" +
    "(1,2),\n" +
    "(1,3),\n" +
    "(1,5),\n" +
    "(2,4),\n" +
    "(3,3),\n" +
    "(3,4),\n" +
    "(4,2),\n" +
    "(5,4);\n" +
    "/*!40000 ALTER TABLE `meal_participants_user` ENABLE KEYS */;\n" +
    "UNLOCK TABLES;\n" +
    "\n" +
    "--\n" +
    "-- Table structure for table `user`\n" +
    "--\n" +
    "\n" +
    "DROP TABLE IF EXISTS `user`;\n" +
    "/*!40101 SET @saved_cs_client     = @@character_set_client */;\n" +
    "/*!40101 SET character_set_client = utf8 */;\n" +
    "CREATE TABLE `user` (\n" +
    "  `id` int NOT NULL AUTO_INCREMENT,\n" +
    "  `firstName` varchar(255) NOT NULL,\n" +
    "  `lastName` varchar(255) NOT NULL,\n" +
    "  `isActive` tinyint NOT NULL DEFAULT '1',\n" +
    "  `emailAdress` varchar(255) NOT NULL,\n" +
    "  `password` varchar(255) NOT NULL,\n" +
    "  `phoneNumber` varchar(255) DEFAULT '-',\n" +
    "  `roles` set('admin','editor','guest') NOT NULL DEFAULT 'editor,guest',\n" +
    "  `street` varchar(255) NOT NULL,\n" +
    "  `city` varchar(255) NOT NULL,\n" +
    "  PRIMARY KEY (`id`),\n" +
    "  UNIQUE KEY `IDX_87877a938268391a71723b303c` (`emailAdress`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;\n" +
    "/*!40101 SET character_set_client = @saved_cs_client */;\n" +
    "\n" +
    "--\n" +
    "-- Dumping data for table `user`\n" +
    "--\n" +
    "\n" +
    "LOCK TABLES `user` WRITE;\n" +
    "/*!40000 ALTER TABLE `user` DISABLE KEYS */;\n" +
    "INSERT INTO `user` VALUES \n" +
    "(1,'Mariëtte','van den Dullemen',1,'m.vandullemen@server.nl','secret','','','',''),\n" +
    "(2,'John','Doe',1,'j.doe@server.com','secret','06 12425475','editor,guest','',''),\n" +
    "(3,'Herman','Huizinga',1,'h.huizinga@server.nl','secret','06-12345678','editor,guest','',''),\n" +
    "(4,'Marieke','Van Dam',0,'m.vandam@server.nl','secret','06-12345678','editor,guest','',''),\n" +
    "(5,'Henk','Tank',1,'h.tank@server.com','secret','06 12425495','editor,guest','','');\n" +
    "/*!40000 ALTER TABLE `user` ENABLE KEYS */;\n" +
    "UNLOCK TABLES;\n" +
    "/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;\n" +
    "\n" +
    "/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;\n" +
    "/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;\n" +
    "/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;\n" +
    "/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;\n" +
    "/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;\n" +
    "/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;\n" +
    "/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;\n" +
    "\n" +
    "-- Dump completed on 2022-04-26 15:57:54"