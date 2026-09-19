---
title: "Route Redistribute"
description: "Belajar bagaimana cara router menerjemahkan informasi dari configurasi routing yang berbeda"
pubDate: 2026-07-22
tags: ["jarkom", "router", "routing"]
---

## Introduction

Dalam membuat sebuah jaringan, kita sering kali menghadapi situasi dimana kita harus menggunakan lebih dari satu protokol routing. Hal ini terjadi karena beberapa alasan:

- **Penggabungan Jaringan:** Dua ruangan menggunakan protokol routing yang berbeda (misal, satu menggunakan OSPF dan lainnya menggunakan RIPv2).
- **Keterbatasan Perangkat:** Pernagkat lama hanya mendukung RIPv2, sementara perangkat baru menggunakan OSPF yang lebih modern.

## Masalah Utama

Secara default, protokol routing yang berbeda tidak dapat saling bertukar informasi, misal RIPv2 tidak bisa membaca informasi dari OSPF dan sebaliknya.

![Contoh gambar](/images/contoh.png)

## Route Redistribution

Teknik untuk mengambil sebuah informasi dari suatu protokol routing lalu menerjemahkan ke protokol routing yang berbeda.

### Contoh Implementasi

![Contoh Implementasi Route Redistribution](/images/contoh-route.png)

## Gas Praktek

Untuk mempraktekan Route Redistribution, silakan download template pada link ini:
[Template Cisco Packet Tracer](/template-route-redistribution.pkt)

### Subnetting Table

#### Perangkat Klien

| Nama Perangkat | Alamat IP   | Subnet Mask   | Router   |
| -------------- | ----------- | ------------- | -------- |
| PC             | 192.168.1.2 | 255.255.255.0 | Router A |
| Laptop         | 192.168.1.3 | 255.255.255.0 | Router A |
| PC             | 192.168.2.2 | 255.255.255.0 | Router B |
| Laptop         | 192.168.2.3 | 255.255.255.0 | Router B |

#### Perangkat Router

| Nama Perangkat      | PORT      | Alamat IP  | Subnet Mask     |
| ------------------- | --------- | ---------- | --------------- |
| Router A (OSPF)     | Serial2/0 | 10.10.10.1 | 255.255.255.252 |
| Router B (Boundary) | Serial2/0 | 10.10.10.2 | 255.255.255.252 |
| Router B (Boundary) | Serial3/0 | 10.10.10.5 | 255.255.255.252 |
| Router C (RIPv2)    | Serial2/0 | 10.10.10.6 | 255.255.255.252 |

### Konfigurasi Routing dan Route Redistribution

#### Router A

```bash
Router>enable
Router#configure terminal
Router(config)#router ospf 1
Router(config-router)#network 10.10.10.0 0.0.0.3 area 1
Router(config-router)#network 192.168.1.0 0.0.0.255 area 1
Router(config-router)#exit
```

#### Router C

```bash
Router>enable
Router#configure terminal
Router(config)#router rip
Router(config-router)#version 2
Router(config-router)#no auto-summary
Router(config-router)#network 10.10.10.4
Router(config-router)#network 192.168.2.0
Router(config-router)#exit
```

#### Router B

```bash
# Konfigurasi Routing RIPv2
Router>enable
Router#configure terminal
Router(config)#router rip
Router(config-router)#version 2
Router(config-router)#no auto-summary
Router(config-router)#network 10.10.10.4
Router(config-router)#exit

# Konfigurasi Routing OSPF
Router(config)#router ospf 1
Router(config-router)#network 10.10.10.0 0.0.0.3 area 1
Router(config-router)#exit

#Konfigurasi Redistribute Routing Protocol (RIPv2 ke OSPF)
Router(config)#router rip
Router(config-router)#version 2
Router(config-router)#redistribute ospf 1 metric 1
Router(config-router)#exit

# Konfigurasi Redistribute Routing Protocol (OSPF ke RIPv2)
Router(config)#router ospf 1
Router(config-router)#redistribute rip subnets
Router(config-router)#exit
```

### Penjelasan Konfigurasi

| Command                      | Penjelasan                                                                                                                                                                                                 |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| redistribute ospf 1 metric 1 | Menerjemahkan informasi dari OSPF dengan _process-id_ 1, lalu konversi nilai metrik OSPF menjadi metrik RIP (Hop Count). Angka 1 berarti semua rute yang diimpor dari OSPF akan dianggap berjarak 1 (Hop). |
| redistribute rip subnets     | Menerjemahkan informasi dari protokol RIP, lalu memerintah OSPF untuk mendistribusikan rute-rute yang udah di-_subnets_ (classless/VLSM).                                                                  |

### Pengecekan Hasil

Untuk mengecek hasil apakah konfigurasi sudah berjalan dengan baik, kita dapat mencoba mengirimkan pesan dari PC dari Router A ke Router C atau sebaliknya. Atau, kita juga dapat mengeceknya dengan menggunakan Command Prompt, dengan cara menulis prompt berikut di Command Prompt PC.

```bash
ping 192.168.2.2 # untuk mengecek dari klien router A ke klien router B
ping 192.168.1.2 # untuk mengecek dari klien router B ke klien router A
```

---
