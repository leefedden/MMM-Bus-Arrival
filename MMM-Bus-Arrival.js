Module.register('MMM-Bus-Arrival', {

    defaults: {
            app_id:     '',
            api_key:    '',
            show_all:   true,
            interval:   60000 // Every 1 min
        },


    start:  function() {
        Log.info('Starting module: ' + this.name);

        if (this.data.classes === 'MMM-Bus-Arrival') {
            this.data.classes = 'bright medium';
            }

        // Set up the local values, here we construct the request url to use
        this.loaded = false;
        this.url = 'https://api.tfl.gov.uk/StopPoint/490013900N/arrivals';
        this.location = '490013900N';
        this.result = null;

        // Trigger the first request
        this.getBusArrivalData(this);
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
        var timeToArrive = 0;

        // If we have some data to display then build the results table        
        if (this.loaded) {
            if (this.result !== null) {
		
		this.result.sort(function(a,b) {return (a.timeToStation > b.timeToStation) ? 1 : ((b.timeToStation > a.timeToStation) ? -1 : 0);} ); 

                tubeResults = document.createElement('table');
                tubeResults.className = 'tubeStatus bright';

                for (var i=0; i < this.result.length; i++) {
                    lineRow = document.createElement('tr');

                    lineName = document.createElement('td');
                    lineName.innerHTML = this.result[i].lineName;

                    lineDestination = document.createElement('td');
                    lineDestination.innerHTML = this.result[i].destinationName;

                    lineArrival = document.createElement('td');
		    
		    timeToArrive = parseInt(this.result[i].timeToStation / 60) + ' minutes';
		    if (timeToArrive < 1) {
			timeToArrive = 'Due';
		    }
                    lineArrival.innerHTML = timeToArrive;

                    lineRow.appendChild(lineName);
                    lineRow.appendChild(lineDestination);
                    lineRow.appendChild(lineArrival);

                    tubeResults.appendChild(lineRow);
                   
                    }
                wrapper.appendChild(tubeResults);
                
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
