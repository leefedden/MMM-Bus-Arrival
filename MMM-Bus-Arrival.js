Module.register('MMM-Bus-Arrival', {

    defaults: {
            app_id:     '',
            api_key:    '',
            show_all:   true,
            interval:   600000 // Every 10 mins
        },


    start:  function() {
        Log.log('Starting module: ' + this.name);

        if (this.data.classes === 'MMM-Bus-Arrival') {
            this.data.classes = 'bright medium';
            }

        // Set up the local values, here we construct the request url to use
        this.loaded = false;
        /* this.url = 'https://api.tfl.gov.uk/StopPoint/'; */
        this.url = 'https://api.tfl.gov.uk/StopPoint/490013900N/arrivals'
        this.location = '490013900N';
        this.result = null;

        // Trigger the first request
        this.getTubeStatusData(this);
        },


    getStyles: function() {
        return ['bus-arrival.css', 'font-awesome.css'];
        },


    getBusArrivalData: function(that) {
        // Make the initial request to the helper then set up the timer to perform the updates
        that.sendSocketNotification('GET-BUS-ARRIVAL', that.url);
        setTimeout(that.getBusArrivalData, that.config.interval, that);
        },


    getDom: function() {
        // Set up the local wrapper
        var wrapper = document.createElement('div');
        var goodService = 0;

        // If we have some data to display then build the results table
        
        if (this.loaded) {
        	wrapper.innerHTML = this.result;
        	/*
            if (this.result !== null) {
                tubeResults = document.createElement('table');
                tubeResults.className = 'tubeStatus bright';

                for (var i=0; i < this.result.length; i++) {
                    lineRow = document.createElement('tr');

                    lineName = document.createElement('td');
                    lineName.className = 'lineName ' + this.result[i].id;
                    lineName.innerHTML = this.result[i].name;

                    lineStatus = document.createElement('td');

                    for (var j=0; j < this.result[i].lineStatuses.length; j++) {
                        if (this.result[i].lineStatuses[j].validityPeriods.length < 2) {
                            severity = this.result[i].lineStatuses[j].statusSeverityDescription;
                            lineStatus.innerHTML = this.result[i].lineStatuses[j].statusSeverityDescription;
                        } else {
                            for (var k=0; k < this.result[i].lineStatuses[j].validityPeriods.length; k++) {
                                if (this.result[i].lineStatuses[j].validityPeriods[k].isNow) {
                                    severity = this.result[i].lineStatuses[j].statusSeverityDescription;
                                    }
                                }
                            }
                        }

                    switch (severity) {
                        case 'Good Service':
                        case 'No Issues':
                            lineStatus.className = 'lineStatus goodStatus';
                            break;
                        case 'Part Closure':
                        case 'Minor Delays':
                        case 'Part Suspended':
                        case 'Reduced Service':
                        case 'Bus Service':
                        case 'Part Closed':
                        case 'No Step Free Access':
                        case 'Diverted':
                        case 'Issues Reported':
                            lineStatus.className = 'lineStatus poorStatus';
                            break;
                        case 'Closed':
                        case 'Service Closed':
                        case 'Planned Closure':
                        case 'Suspended':
                        case 'Severe Delays':
                        case 'Exit Only':
                        case 'Not Running':
                            lineStatus.className = 'lineStatus badStatus';
                            break;
                        default:
                            lineStatus.className = 'lineStatus';
                            break;
                        }

                    lineStatus.innerHTML = severity;

                    lineRow.appendChild(lineName);
                    lineRow.appendChild(lineStatus);

                    if (this.config.show_all) {
                        tubeResults.appendChild(lineRow);
                    } else {
                        if (lineStatus.innerHTML != 'Good Service') {
                            tubeResults.appendChild(lineRow);
                        } else {
                            goodService++;

                            if (goodService === this.result.length) {
                                allRow = document.createElement('tr');

                                allLines = document.createElement('td');
                                allLines.className = 'lineName allLines';
                                allLines.innerHTML = 'All Lines';

                                allStatus = document.createElement('td');
                                allStatus.className = 'lineStatus goodService';
                                allStatus.innerHTML = 'Good Service';

                                allRow.appendChild(allLines);
                                allRow.appendChild(allStatus);

                                tubeResults.appendChild(allRow);
                                }
                            }
                        }


                    }
                wrapper.appendChild(tubeResults);
                */
            } else {
                // Otherwise lets just use a simple div
                wrapper.innerHTML = 'Error getting bus arrival times.';
                }
        } else {
            // Otherwise lets just use a simple div
            wrapper.innerHTML = 'Loading bus arrival times...';
            }

        return wrapper;
        },


    socketNotificationReceived: function(notification, payload) {
        // check to see if the response was for us and used the same url
        if (notification === 'GOT-BUS-ARRIVAL' && payload.url === this.url) {
                // we got some data so set the flag, stash the data to display then request the dom update
                this.loaded = true;
                this.result = payload.result;
                this.updateDom(1000);
            }
        }
    });
