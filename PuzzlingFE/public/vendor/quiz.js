/*--------loader script-----------*/
$(function () {
    timer();

    function timer() {
        const FULL_DASH_ARRAY = 283;
        const WARNING_THRESHOLD = 10;
        const ALERT_THRESHOLD = 5;
        const COLOR_CODES = {
            info: {
                color: "green"
            },
            warning: {
                color: "orange",
                threshold: WARNING_THRESHOLD
            },
            alert: {
                color: "red",
                threshold: ALERT_THRESHOLD
            }
        };
        const TIME_LIMIT = 20;
        let timePassed = 0;
        let timeLeft = TIME_LIMIT;
        let timerInterval = null;
        let remainingPathColor = COLOR_CODES.info.color;
        document.getElementById("app").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
            timeLeft
        )}</span>
</div>
`;
        startTimer();

        function onTimesUp() {

            clearInterval(timerInterval);
        }


        function startTimer() {

            timerInterval = setInterval(() => {
                timePassed = timePassed += 1;
                timeLeft = TIME_LIMIT - timePassed;
                document.getElementById("base-timer-label").innerHTML = formatTime(
                    timeLeft
                );
                setCircleDasharray();
                setRemainingPathColor(timeLeft);
                //When the question changes, the timer resets.
                if (check_click == 1) {
                    setTimeout(function () {

                        onTimesUp();
                        timer();

                        $('#quiz').show();
                        $('#loadbar').fadeOut();
                    }, 1500);

                    check_click = 0;
                    return check_click;
                }

                if (timeLeft === 0) {
                    //When the timer is over, the next question comes and the timer reset.
                    onTimesUp();
                    questionNo++;
                    updateProgress();
                    if ((questionNo + 1) > q.length) {
                        document.getElementById('quiz_web').innerHTML = "";
                        // alert("Quiz completed, Now click ok to get your answer");
                        $('label.element-animation').unbind('click');
                        setTimeout(function () {
                            var toAppend = '';
                            $.each(q, function (i, a) {
                                toAppend += '<tr>'
                                toAppend += '<td>' + (i + 1) + '</td>';
                                toAppend += '<td>' + a.A + '</td>';
                                toAppend += '<td>' + a.UC + '</td>';
                                toAppend += '<td>' + a.result + '</td>';
                                toAppend += '</tr>'
                            });
                            $('#scoreModal').modal('show');
                            $('#quizResult').html(toAppend);
                            $('#totalCorrect').html(correctCount * 10);
                            $('#quizResult').show();
                            $('#loadbar').fadeOut();
                            $('#result-of-question').show();
                            $('#graph-result').show();
                            chartMake();
                        }, 1000);
                    } else {
                        //reset timer
                        timer();

                        $('#qid').html(questionNo + 1);
                        $('input:radio').prop('checked', false);
                        setTimeout(function () {

                            $('#quiz').show();
                            $('#loadbar').fadeOut();
                        }, 1500);
                        $('#question').html(q[questionNo].Q);
                        $($('#f-option').parent().find('label')).html(q[questionNo].C[0]);
                        $($('#s-option').parent().find('label')).html(q[questionNo].C[1]);
                        $($('#t-option').parent().find('label')).html(q[questionNo].C[2]);
                        $($('#x-option').parent().find('label')).html(q[questionNo].C[3]);
                    }
                }

            }, 1000);
        }

        function formatTime(time) {

            const minutes = Math.floor(time / 60);
            let seconds = time % 60;
            if (seconds < 10) {
                seconds = `0${seconds}`;
            }

            return `${seconds}`;
        }

        function setRemainingPathColor(timeLeft) {
            const {
                alert,
                warning,
                info
            } = COLOR_CODES;
            if (timeLeft <= alert.threshold) {
                document
                    .getElementById("base-timer-path-remaining")
                    .classList.remove(warning.color);
                document
                    .getElementById("base-timer-path-remaining")
                    .classList.add(alert.color);
            } else if (timeLeft <= warning.threshold) {
                document
                    .getElementById("base-timer-path-remaining")
                    .classList.remove(info.color);
                document
                    .getElementById("base-timer-path-remaining")
                    .classList.add(warning.color);
            }
        }

        function calculateTimeFraction() {
            const rawTimeFraction = timeLeft / TIME_LIMIT;
            return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
        }

        function setCircleDasharray() {
            const circleDasharray = `${(
                calculateTimeFraction() * FULL_DASH_ARRAY
            ).toFixed(0)} 283`;
            document
                .getElementById("base-timer-path-remaining")
                .setAttribute("stroke-dasharray", circleDasharray);
        }
    };
    var loading = $('#loadbar').hide();
    $(document)
        .ajaxStart(function () {
            loading.show();
        }).ajaxStop(function () {
        loading.hide();
    });
    var questionNo = 0;
    var correctCount = 0;
    var check_click = 0;
    var q = [{
        'Q': 'Which is National game of India?',
        'A': 2,
        'C': ['Cricket;', 'Hockey;', 'Football', 'Kabaddi']
    },
        {
            'Q': 'Who was first individual Olympic medal winner from independent India?',
            'A': 3,
            'C': ['Pradip Bode', 'Harihar Banerjee', 'KD Jadav', 'Milkha Singh']
        },
        {
            'Q': 'In which stadium Sachin Tendulkar completed his 100th century?',
            'A': 1,
            'C': ['Shere Bangla stadium', 'Eden Garden', 'Firoz shah Kotla Stadium', 'None of the above']
        },
        {
            'Q': 'Who is the first Indian woman to win as Asian Games gold in 4oom run?',
            'A': 2,
            'C': ['M.L. Valsamma', 'Kamaljit Sandhu', 'PT Usha', 'K Malleshwari']
        },
        {
            'Q': 'Who was indian first football caption?',
            'A': 3,
            'C': ['P K Banerjee', 'Shailen Manna', 'Talimeren Ao', 'SC Goswami']
        }

    ];
    //Progress Bar
    var progress, progressPercentage; // progress bar

    progress = document.getElementsByClassName('progress-bar')[0];

    function updateProgress() {
        // progress bar will be updated as count goes up

        progressPercentage = Math.round((questionNo / 5) * 100);
        progress.style.width = progressPercentage + '%';
    }

    $(document.body).on('click', "label.element-animation", function (e) {
        check_click = 1;
        //ripple start
        var parent, ink, d, x, y;
        parent = $(this);
        if (parent.find(".ink").length == 0)
            parent.prepend("<span class='ink'></span>");
        ink = parent.find(".ink");
        ink.removeClass("animate");
        if (!ink.height() && !ink.width()) {
            d = Math.max(parent.outerWidth(), parent.outerHeight());
            ink.css({
                height: "100px",
                width: "45%"
            });
            // ink.css({border-radius:"8px"});
        }

        x = e.pageX - parent.offset().left - ink.width() / 2;
        y = e.pageY - parent.offset().top - ink.height() / 2;
        ink.css({
            top: y + 'px',
            left: x + 'px'
        }).addClass("animate");
        //ripple end

        var choice = $(this).parent().find('input:radio').val();
        console.log(choice);
        var anscheck = $(this).checking(questionNo, choice); //$( "#answer" ).html(  );      
        q[questionNo].UC = choice;
        if (anscheck) {
            correctCount++;
            q[questionNo].result = "Correct";
        } else {
            q[questionNo].result = "Incorrect";
        }
        console.log("CorrectCount:" + correctCount);
        setTimeout(function () {

            $('#loadbar').show();
            $('#quiz').fadeOut();
            questionNo++;
            updateProgress();
            // stop timer here
            if ((questionNo + 1) > q.length) {
                document.getElementById('quiz_web').innerHTML = "";
                // alert("Quiz completed, Now click ok to get your answer");
                $('label.element-animation').unbind('click');
                setTimeout(function () {
                    var toAppend = '';
                    $.each(q, function (i, a) {
                        toAppend += '<tr>'
                        toAppend += '<td>' + (i + 1) + '</td>';
                        toAppend += '<td>' + a.A + '</td>';
                        toAppend += '<td>' + a.UC + '</td>';
                        toAppend += '<td>' + a.result + '</td>';
                        toAppend += '</tr>'
                    });
                    $('#scoreModal').modal('show');
                    $('#quizResult').html(toAppend);
                    $('#totalCorrect').html(correctCount * 10);
                    $('#quizResult').show();
                    $('#loadbar').fadeOut();
                    $('#result-of-question').show();
                    $('#graph-result').show();
                    chartMake();
                }, 1000);
            } else {
                $('#qid').html(questionNo + 1);
                $('input:radio').prop('checked', false);
                setTimeout(function () {

                    $('#quiz').show();
                    $('#loadbar').fadeOut();
                }, 1500);
                $('#question').html(q[questionNo].Q);
                $($('#f-option').parent().find('label')).html(q[questionNo].C[0]);
                $($('#s-option').parent().find('label')).html(q[questionNo].C[1]);
                $($('#t-option').parent().find('label')).html(q[questionNo].C[2]);
                $($('#x-option').parent().find('label')).html(q[questionNo].C[3]);
            }
        }, 1000);
    });
    $.fn.checking = function (qstn, ck) {
        var ans = q[questionNo].A;
        if (ck != ans)
            return false;
        else
            return true;
    };

    // chartMake();
    function chartMake() {

        var chart = AmCharts.makeChart("chartdiv", {
            "type": "serial",
            "theme": "dark",
            "dataProvider": [{
                "name": "Correct",
                "points": correctCount,
                "color": "#00FF00",
                "bullet": "http://i2.wp.com/img2.wikia.nocookie.net/__cb20131006005440/strategy-empires/images/8/8e/Check_mark_green.png?w=250"
            }, {
                "name": "Incorrect",
                "points": q.length - correctCount,
                "color": "red",
                "bullet": "http://4vector.com/i/free-vector-x-wrong-cross-no-clip-art_103115_X_Wrong_Cross_No_clip_art_medium.png"
            }],
            "valueAxes": [{
                "maximum": q.length,
                "minimum": 0,
                "axisAlpha": 0,
                "dashLength": 4,
                "position": "left"
            }],
            "startDuration": 1,
            "graphs": [{
                "balloonText": "<span style='font-size:13px;'>[[category]]: <b>[[value]]</b></span>",
                "bulletOffset": 10,
                "bulletSize": 52,
                "colorField": "color",
                "cornerRadiusTop": 8,
                "customBulletField": "bullet",
                "fillAlphas": 0.8,
                "lineAlpha": 0,
                "type": "column",
                "valueField": "points"
            }],
            "marginTop": 0,
            "marginRight": 0,
            "marginLeft": 0,
            "marginBottom": 0,
            "autoMargins": false,
            "categoryField": "name",
            "categoryAxis": {
                "axisAlpha": 0,
                "gridAlpha": 0,
                "inside": true,
                "tickLength": 0
            }
        });
    }
});