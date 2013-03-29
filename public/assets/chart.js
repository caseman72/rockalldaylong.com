

        $('#container').highcharts({
            chart: {
                type: 'bar'
            },
            exporting: {
                enabled: false
            },
            title: {
                text: 'Historic World Population by Region'
            },
            xAxis: {
                categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Time per Digit (milliseconds)',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                data: [107, 31, 635, 203, 2]
            }]
        });