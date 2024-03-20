function getNextClass() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json_schedule = JSON.parse(xhr.responseText);
            var result = findNextClass(json_schedule);
            document.getElementById("result").innerHTML = result;
        }
    };
    xhr.open("GET", "schedule.json", true);
    xhr.send();
}

function findNextClass(schedule) {
    var current_time = new Date();
    var current_day = current_time.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

    if (current_day in schedule["time_table"]["days"]) {
        var today_schedule = schedule["time_table"]["days"][current_day];
        for (var i = 0; i < today_schedule.length; i++) {
            var class_time_str = Object.keys(today_schedule[i])[0];
            var class_start_time_str = class_time_str.split(" - ")[0];
            var class_end_time_str = class_time_str.split(" - ")[1];

            var class_start_time = new Date(current_time.toDateString() + ' ' + class_start_time_str);
            var class_end_time = new Date(current_time.toDateString() + ' ' + class_end_time_str);

            if (class_start_time <= current_time && current_time <= class_end_time) {
                var time_left = getTimeLeft(class_end_time);
                var class_name = today_schedule[i][class_time_str];
                var building_name = class_name.split('[')[1].split(']')[0];
                return `Ongoing class at ${class_start_time_str} in building ${building_name}.<br>Class name: ${class_name}.<br>Time left: ${time_left}`;
            } else if (class_start_time > current_time) {
                var time_left = getTimeLeft(class_start_time);
                var class_name = today_schedule[i][class_time_str];
                var building_name = class_name.split('[')[1].split(']')[0];
                return `Next class is at ${class_start_time_str} in building ${building_name}.<br>Class name: ${class_name}.<br>Time left: ${time_left}`;
            }
        }

        var nextDay = new Date();
        nextDay.setDate(current_time.getDate() + 1);
        var nextDayName = nextDay.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

        if (nextDayName in schedule["time_table"]["days"]) {
            var nextDaySchedule = schedule["time_table"]["days"][nextDayName][0];
            var nextClassTime = Object.keys(nextDaySchedule)[0];
            var nextClassName = nextDaySchedule[nextClassTime];

            return `No more classes for today.<br><br>Next class is on ${nextDayName} at ${nextClassTime}.<br>Class name: ${nextClassName}`;
        } else {
            return "No classes scheduled for today or tomorrow.<br>";
        }
    }
    return "No classes scheduled for today.<br>";
}

function getTimeLeft(endTime) {
    var timeDiff = endTime - new Date();
    var hours = Math.floor(timeDiff / (1000 * 60 * 60));
    var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${hours}:${minutes}:${seconds}`;
}

// stagerring 
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry);
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));
