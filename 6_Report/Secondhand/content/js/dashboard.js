/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2803333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2675, 500, 1500, "Delete  Products"], "isController": false}, {"data": [0.3275, 500, 1500, "Get Categories"], "isController": false}, {"data": [0.015, 500, 1500, "Update Profile"], "isController": false}, {"data": [0.36, 500, 1500, "Create Products"], "isController": false}, {"data": [0.3825, 500, 1500, "Get Profile"], "isController": false}, {"data": [0.41, 500, 1500, "Create Offers"], "isController": false}, {"data": [0.2075, 500, 1500, "Get Offers"], "isController": false}, {"data": [0.5, 500, 1500, "Get ProductsId"], "isController": false}, {"data": [0.3075, 500, 1500, "Update Offers"], "isController": false}, {"data": [0.425, 500, 1500, "Get Products"], "isController": false}, {"data": [0.0275, 500, 1500, "Registration"], "isController": false}, {"data": [0.065, 500, 1500, "Sign_in Buyer"], "isController": false}, {"data": [0.45, 500, 1500, "Get Categories By Id"], "isController": false}, {"data": [0.0225, 500, 1500, "Sign_in Seller"], "isController": false}, {"data": [0.4375, 500, 1500, "Update  Products"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3000, 0, 0.0, 1548.2216666666682, 28, 4222, 1421.0, 2492.8, 2817.8999999999996, 3221.959999999999, 12.767315671879986, 44.37883185711246, 21.427541327534843], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete  Products", 200, 0, 0.0, 1490.9450000000004, 28, 2599, 1498.0, 2164.9, 2283.85, 2530.2700000000004, 0.9345445030092333, 0.8021567826903667, 0.41251378453141935], "isController": false}, {"data": ["Get Categories", 200, 0, 0.0, 1319.03, 185, 2424, 1301.5, 2101.6, 2205.95, 2354.95, 0.9314759702486576, 0.9733196173496714, 0.13098880831621745], "isController": false}, {"data": ["Update Profile", 200, 0, 0.0, 2381.7099999999996, 1017, 4222, 2347.5, 3062.8, 3240.7499999999995, 3928.890000000002, 0.9288500835965074, 1.287944977243173, 5.124508543969441], "isController": false}, {"data": ["Create Products", 200, 0, 0.0, 1357.975, 760, 2210, 1333.0, 1746.0, 1854.95, 2150.970000000001, 0.9255017376295124, 1.9819113577573242, 13.741495506689064], "isController": false}, {"data": ["Get Profile", 200, 0, 0.0, 1293.5500000000002, 198, 3128, 1279.5, 1733.9, 2139.2499999999986, 2340.6100000000006, 0.9285180387841985, 1.2875026985055502, 0.3817442327423316], "isController": false}, {"data": ["Create Offers", 200, 0, 0.0, 1217.1799999999992, 412, 2109, 1200.5, 1683.2000000000003, 1824.4499999999998, 2097.71, 0.9202129372736851, 2.4214855270634623, 0.47538344122830023], "isController": false}, {"data": ["Get Offers", 200, 0, 0.0, 1582.3299999999995, 808, 2743, 1564.5, 2003.9, 2344.099999999998, 2652.63, 0.92103081769116, 15.2992932815407, 0.38766043205555656], "isController": false}, {"data": ["Get ProductsId", 200, 0, 0.0, 958.4949999999997, 439, 1784, 953.0, 1270.7, 1405.55, 1747.4700000000023, 0.9301763149204932, 2.1540212830154455, 0.3560831205555013], "isController": false}, {"data": ["Update Offers", 200, 0, 0.0, 1414.5299999999988, 533, 3122, 1353.5, 1970.5, 2187.95, 2472.3800000000006, 0.919079633654858, 2.4133918231782694, 0.44338412014208967], "isController": false}, {"data": ["Get Products", 200, 0, 0.0, 1176.6799999999992, 406, 2253, 1141.0, 1700.4, 2009.499999999999, 2195.290000000001, 0.9348328051527984, 12.15351115898234, 0.35512691523870954], "isController": false}, {"data": ["Registration", 200, 0, 0.0, 2249.1150000000016, 1128, 3668, 2184.0, 2887.6000000000004, 3113.3499999999995, 3526.680000000001, 0.9130418903619297, 1.5587559932640334, 0.2741443941510536], "isController": false}, {"data": ["Sign_in Buyer", 200, 0, 0.0, 2265.2099999999987, 840, 3417, 2308.5, 3100.1, 3167.0, 3315.2400000000007, 0.9224368937860039, 1.8286140356844711, 0.2711460010054562], "isController": false}, {"data": ["Get Categories By Id", 200, 0, 0.0, 1033.5150000000003, 102, 2431, 978.0, 1648.9, 1915.2999999999997, 2305.1000000000017, 0.9383635877393414, 0.6726160873053482, 0.1337901209081483], "isController": false}, {"data": ["Sign_in Seller", 200, 0, 0.0, 2333.605000000001, 834, 4002, 2283.0, 3104.0, 3261.5499999999997, 3542.3400000000015, 0.9127168843496436, 1.815023091737174, 0.26650619962943695], "isController": false}, {"data": ["Update  Products", 200, 0, 0.0, 1149.4549999999983, 476, 2337, 1155.5, 1566.4, 1670.3999999999999, 1810.7900000000002, 0.9229093795280241, 1.6075747498915582, 0.5587927883861084], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
