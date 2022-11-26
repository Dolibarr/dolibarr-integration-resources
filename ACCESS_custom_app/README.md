# Application maison développée sur ACCESS

## Auteur du document

Éric Seigne - CAP-REL - https://cap-rel.fr

## Présentation

L'entreprise a un outil de facturation / suivi développée sur ACCESS.

## Solution

Lecture des fichiers MDB à l'aide de ADBC -> mauvaise idée

Solution : utlisation des mdb-tools pour convertir le fichier mdb vers autre chose utilisable.
 - 1ere utilisation : convert mdb to json -> lourd pour les traitements suivants
 - 2° solution : convert mdb to sql puis import du sql dans mysql puis migration :-)


Script de conversion mdb vers sql

```
#!/bin/bash
# export des données des fichiers MDB
FILE="/tmp/fichier.mdb"

typeset -i indice
indice=1

fullfilename=${FILE}
filename=$(basename "$fullfilename")
dbname=${filename%.*}

mkdir "$dbname"

IFS=$'\n'
for table in $(mdb-tables -1 "$fullfilename"); do
    echo "Export table $table"
    mdb-export -D '%Y-%m-%d %H:%M:%S' -I mysql "$fullfilename" "$table" > "$dbname/$table.sql"
done

#le schema
mdb-schema --drop-table  --default-values --not-null --no-indexes --no-relations ${fullfilename} mysql > ${dbname}.sql

# nettoyage d'un bug du fichier SQL produit
sed -i -e s/"=0"/"0"/ ${dbname}.sql
# ensuite import dans mysql avec un appel du genre
#cat ${dbname}.sql | mysql bdname

# 2. les données
# et ensuite tous les fichiers des tables
#cat *.sql | mysql bdname
```

