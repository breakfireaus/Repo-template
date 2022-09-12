// Current Date time
var currentDateEl = $('#currentDate');
var currentDate;
var currentTime;

// Save to and Retrieve from Local storage

var calEntryEventTime;
var calEntryEventTxt;
var timeArr = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

// save button
var saveBtn = $('.saveBtn');

// determine the colour state
var calTimeBlock;
var timerInterval;
var timeblockID = $("textarea[id*='timeblock']");

//Calls the functions to render the date and events to the DOM & update the colours

function init() {
    currentMomentDate();
    renderEvents();
    setBGColors();
};

// Retrieves the current date and renders it in the Jumbotrom Header 
function currentMomentDate() {
    currentDate = moment().format('LLLL');
    currentDateEl.text(currentDate);
};

// Renders events that are pulled from local storage and places them in the DOM 
function renderEvents() {
    for (let i = 0; i < timeArr.length; i++) {
        $('[id^=timeblock-]').each(function (i, v) {
            $(v).val(localStorage.getItem(timeArr[i]));
        })
    }
};

// Triggers the click handler for the save buttons
saveBtn.on('click', saveButtonClickHandler);

// When Save Button Clicked, the corresponding date and time values
function saveButtonClickHandler(event) {
    // Keeps form from sending
    event.preventDefault();
    // Sets value to the time associated with the clicked save button
    calEntryEventTime = $(this).attr('id').split('-')[1];
    //Sets value to the input of what the user has typed
    calEntryEventTxt = $(this).siblings('textarea[name^="timeblock"]').val().trim();
    // Calls function to store in local storage
    StoreEvents();
};

// Stores the time and the text Values to the local Storage where (time = key) and (user's input text = value)
function StoreEvents() {
    localStorage.setItem(calEntryEventTime, calEntryEventTxt);
};

// Changes the colour of the timeblock according to whether past, present, future (time progression)
function setBGColors() {
    // For each timeblock ID
    timeblockID.each(function () {
        // Split it to display the time contained at the end of the ID,
        calTimeBlock = $(this).attr('id').split('-')[1];
        // convert it to a moment.js format, then an integer
        calTimeBlock = parseInt(moment(calTimeBlock, 'H').format('H'));
        // get moment.js tiome & format identically
        currentTime = parseInt(moment().format('H'));

        if (currentTime < calTimeBlock) {
            $(this).removeClass('past present');
            $(this).addClass('future');
        } else if (currentTime === calTimeBlock) {
            $(this).removeClass('present future');
            $(this).addClass('past');
        } else if (currentTime > calTimeBlock) {
            $(this).removeClass('past future');
            $(this).addClass('present');
        } else {
            console.log("Error in time calculation");
        }
    })
};

// updates the time, date and colours once per minute on the minute
function setIntervalOnMinute() {
    var currentDateSeconds = new Date().getSeconds();
    if (currentDateSeconds == 0) {
        setInterval(currentMomentDate, 60000);
        setInterval(setBGColors, 60000);
    } else {
        setTimeout(function () {
            setIntervalOnMinute();
        }, (60 - currentDateSeconds) * 1000);
    }
    currentMomentDate();
    setBGColors();
};

setIntervalOnMinute();

// initializes page
init();

