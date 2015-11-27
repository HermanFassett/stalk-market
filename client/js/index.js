function StocksCtrl($scope) {
    $scope.stocks = ["GOOG", "MSFT", "YHOO"];
    $scope.addStock = function(stock) {
        if (!$scope.stocks.join(".").match(new RegExp(stock, "gi"))) {
            $scope.stocks.push(stock);
            drawStocks($scope.stocks);
        }
    };
    $scope.removeStock = function(stock) {
        if ($scope.stocks.indexOf(stock) > -1) {
            $scope.stocks.splice($scope.stocks.indexOf(stock), 1);
            drawStocks($scope.stocks);
        }
    };
    drawStocks($scope.stocks);
}
function drawStocks(stocks) {
    var stockData = [];
    for (var i = 0; i < stocks.length; i++) {
        var symbol = stocks[i];
        var base_url = "https://crossorigin.me/http://chartapi.finance.yahoo.com/instrument/1.1/" + symbol + 
                        "/chartdata;type=quote;range=1y/json?callback=r";
        $.ajax({
            url: base_url,
            dataType: "text",
            success: function(data, status, jqxhr) {
                var output = data.substr(2, data.length - 4);
                var parsed = $.parseJSON(output);
                symbol = parsed.meta.ticker.toString().toUpperCase();
                var points = parsed.series;
                var stockPoints = [];
                points.forEach(function(point) {
                    var d = point.Date.toString();
                    var date = new Date(d.substr(0,4) + "-" + d.substr(4,2) + "-" + d.substr(6));
                    stockPoints.push({label: date.toDateString(), y: point.close});
                });
                stockData.push(
                    {
                        toolTipContent: "<b>{name}</b><br>{label} - <i>{y}</i>",
                        type: "spline", 
                        name: symbol, 
                        showInLegend: true, 
                        dataPoints: stockPoints
                        
                    }
                );
                var chart = new CanvasJS.Chart("chartContainer",
                {
                    animationEnabled: true,
                    zoomEnabled: true,
                    title: {
                        text: "Stock Market Chart"
                    },    
                    data: stockData
                });
                chart.render();
            },
            error: function(jqxhr, status, error) {
                console.log(status + ", " + error);
            }
        });
    }
}