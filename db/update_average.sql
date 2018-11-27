update multiplicationdata
set avgtime = $3, timesencountered = $4
where num1 = $1 and num2 = $2
returning *