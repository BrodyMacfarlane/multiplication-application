insert into multiplicationdata(num1, num2, avgtime, timesencountered)
values ($1, $2, $3, $4)
returning *