insert into public.machine_defs (id, created_at, make, model) values
('4cfc8aff-eb5d-4f4d-a93b-af90220aae8d','2023-03-30 07:07:51.818033+00','Dremel','3D40'),
('e6365961-87c4-44ff-99c6-e867be7baee1','2023-03-30 07:08:06.646478+00','Prusa','MK3S+'),
('a7986b82-5d97-42a7-bc9d-7afa1cf569b4','2023-03-30 07:08:27.35594+00','Prusa','MINI+'),
('d53b6d78-771a-4f99-a1a0-0af1587e72af','2023-04-05 01:29:09.408313+00','Ender','3 V1');

insert into public.machines (id, created_at, tier, nickname, machine_defs_id) values
('95c70965-9a45-4a28-93fb-34bab33e35a7','2023-03-30 07:09:03+00',1,'Ironman','4cfc8aff-eb5d-4f4d-a93b-af90220aae8d'),
('e6cd3190-4ebc-421b-a394-ed643843e3a0','2023-03-30 07:13:30.660713+00',1,'Thor','4cfc8aff-eb5d-4f4d-a93b-af90220aae8d'),
('b30cebdd-916e-4d41-b7f4-c22a025b7b56','2023-03-30 07:13:59.609812+00',1,'Bruce Banner','4cfc8aff-eb5d-4f4d-a93b-af90220aae8d'),
('e891762c-496a-4c9f-8aef-d8abde1dbddc','2023-03-30 07:14:36.574638+00',1,'Loki','4cfc8aff-eb5d-4f4d-a93b-af90220aae8d'),
('cb4fb8ad-155e-4dbc-9586-ae756caeef58','2023-03-30 07:14:50.337605+00',1,'Wanda','4cfc8aff-eb5d-4f4d-a93b-af90220aae8d'),
('ed2802f4-9884-47f5-ab47-6c62a0a978f6','2023-03-30 07:13:44.134532+00',1,'Spiderman','4cfc8aff-eb5d-4f4d-a93b-af90220aae8d'),
('89f39ec4-57ce-40d6-8f19-2ceb66e7e006','2023-03-30 07:14:13.190631+00',1,'Doctor Strange','4cfc8aff-eb5d-4f4d-a93b-af90220aae8d'),
('4cfbaf8c-174a-446c-a94f-b89dc18f58e0','2023-04-05 01:27:08.830039+00',2,'Yoda','e6365961-87c4-44ff-99c6-e867be7baee1'),
('82c38bd1-6cd0-4ea3-b955-0e3ae2fa68fa','2023-04-05 01:27:32.034822+00',2,'Vader','e6365961-87c4-44ff-99c6-e867be7baee1'),
('6a214783-cdbe-4c06-88e1-1eb9c6e93b84','2023-04-05 01:27:57.925786+00',2,'Grogu','a7986b82-5d97-42a7-bc9d-7afa1cf569b4'),
('fbd82640-eafe-47ca-b2ce-04bbe81a4504','2023-04-05 01:28:10.98923+00',2,'Luke','a7986b82-5d97-42a7-bc9d-7afa1cf569b4'),
('3194b954-e57f-4337-8719-e864be4337de','2023-04-05 01:29:26.278578+00',2,'R2-D2','d53b6d78-771a-4f99-a1a0-0af1587e72af'),
('82282925-ae42-4780-8c3b-8c078770f2ef','2023-04-05 01:29:39.618806+00',2,'C-3PO','d53b6d78-771a-4f99-a1a0-0af1587e72af'),
('69b9f003-a6f0-43b7-8874-4937e243cc18','2023-04-05 01:30:12.129965+00',2,'BB-8','d53b6d78-771a-4f99-a1a0-0af1587e72af'),
('decddb35-7975-4604-a209-9055d1b4cc27','2023-04-05 01:31:57.184665+00',2,'Han Solo','d53b6d78-771a-4f99-a1a0-0af1587e72af');