# montessory-violay.com

- Registrar : [Gandi](https://admin.gandi.net/domain/9f3dd84c-33e2-11eb-8a62-00163ea99cff/montessori-violay.com/records)
- Compte : nicolas.renvoise.dev@gmail.com

## Configuration

Chemin : **NOM DE DOMAINE > Enregistrements DNS > Vue texte**

Initial :
```
@ 86400 IN SOA ns1.gandi.net. hostmaster.gandi.net. 1606833620 10800 3600 604800 10800
@ 10800 IN A 217.70.184.38
@ 10800 IN MX 10 spool.mail.gandi.net.
@ 10800 IN MX 50 fb.mail.gandi.net.
@ 10800 IN TXT "v=spf1 include:_mailcust.gandi.net ?all"
_imap._tcp 10800 IN SRV 0 0 0   .
_imaps._tcp 10800 IN SRV 0 1 993 mail.gandi.net.
_pop3._tcp 10800 IN SRV 0 0 0   .
_pop3s._tcp 10800 IN SRV 10 1 995 mail.gandi.net.
_submission._tcp 10800 IN SRV 0 1 465 mail.gandi.net.
webmail 10800 IN CNAME webmail.gandi.net.
www 10800 IN CNAME webredir.vip.gandi.net.
```

Avec les IP de GitHub :
```
@ 86400 IN SOA ns1.gandi.net. hostmaster.gandi.net. 1606838965 10800 3600 604800 10800
@ 1800 IN A 185.199.108.153
@ 1800 IN A 185.199.109.153
@ 1800 IN A 185.199.110.153
@ 1800 IN A 185.199.111.153
@ 10800 IN MX 10 spool.mail.gandi.net.
@ 10800 IN MX 50 fb.mail.gandi.net.
@ 10800 IN TXT "v=spf1 include:_mailcust.gandi.net ?all"
_imap._tcp 10800 IN SRV 0 0 0   .
_imaps._tcp 10800 IN SRV 0 1 993 mail.gandi.net.
_pop3._tcp 10800 IN SRV 0 0 0   .
_pop3s._tcp 10800 IN SRV 10 1 995 mail.gandi.net.
_submission._tcp 10800 IN SRV 0 1 465 mail.gandi.net.
webmail 10800 IN CNAME webmail.gandi.net.
www 1800 IN CNAME violay-rainbow-school.github.io.
```

> Le sous-domaine www.montessory-violay.com ne fonctionne pas, je ne sais pas pourquoi.