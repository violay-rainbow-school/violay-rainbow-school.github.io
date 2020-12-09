# montessory-violay.fr

- Registrar : [LWS](https://panel.lws.fr/frhebergement42-dns22.php)

## Configuration

Chemin : **Zone DNS**

Initial :
```
@ 86400 IN NS ns1.lwsdns.com.
@ 86400 IN NS ns2.lwsdns.com.
@ 86400 IN NS ns3.lwsdns.com.
@ 86400 IN NS ns4.lwsdns.com.
@ 86400 IN MX 10 mail.montessori-violay.fr.
@ 21600 IN A 91.216.107.189
mail 21600 IN A 185.98.131.28
ftp 86400 IN CNAME @
imap 86400 IN CNAME mail.montessori-violay.fr.
pop 86400 IN CNAME mail.montessori-violay.fr.
smtp 86400 IN CNAME mail.montessori-violay.fr.
www 86400 IN CNAME @
@ 86400 IN TXT v=spf1 mx:montessori-violay.fr a:mail.montessori-violay.fr a:mailphp.lws-hosting.com -all
```

Avec les IP de GitHub :
```
@ 86400 IN NS ns1.lwsdns.com.
@ 86400 IN NS ns2.lwsdns.com.
@ 86400 IN NS ns3.lwsdns.com.
@ 86400 IN NS ns4.lwsdns.com.
@ 86400 IN MX 10 mail.montessori-violay.fr.
@ 1800 IN A 185.199.110.153
@ 1800 IN A 185.199.109.153
@ 1800 IN A 185.199.108.153
@ 1800 IN A 185.199.111.153
mail 21600 IN A 185.98.131.28
ftp 86400 IN CNAME @
imap 86400 IN CNAME mail.montessori-violay.fr.
pop 86400 IN CNAME mail.montessori-violay.fr.
smtp 86400 IN CNAME mail.montessori-violay.fr.
www 86400 IN CNAME @
@ 86400 IN TXT v=spf1 mx:montessori-violay.fr a:mail.montessori-violay.fr a:mailphp.lws-hosting.com -all
```
