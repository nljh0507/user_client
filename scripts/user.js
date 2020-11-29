let constraints = { video: { facingMode: "user" }, audio: false };
const cameraView = document.querySelector("#camera--view");
const cameraOutput = document.querySelector("#camera--output");
const cameraSensor = document.querySelector("#camera--sensor");
const cameraTrigger = document.querySelector("#camera--trigger");

// 페이지가 로드되면 함수 실행
window.addEventListener("load", function () {
	cameraStart();
	printClock();
});

function cameraStart() {
	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(function (stream) {
			track = stream.getTracks()[0];
			cameraView.srcObject = stream;
		})
		.catch(function (error) {
			console.error("카메라에 문제가 있습니다.", error);
		});
}

// 촬영 버튼 클릭 리스너 ('저장' 부분을 '서버/딥 러닝 모듈로 전송'으로 변경해야 함)
cameraTrigger.addEventListener("click", function () {
	var currentDate = new Date();
	var now =
		currentDate.getFullYear().toString() +
		addZeros(currentDate.getMonth() + 1, 2) +
		addZeros(currentDate.getDate(), 2) +
		addZeros(currentDate.getHours(), 2) +
		addZeros(currentDate.getMinutes(), 2) +
		addZeros(currentDate.getSeconds(), 2);

	cameraSensor.width = cameraView.videoWidth;
	cameraSensor.height = cameraView.videoHeight;
	cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
	var dataURL = cameraSensor.toDataURL("image/jpeg", 1.0);
	const decodImg = atob(dataURL.split(',')[1]);
	let array = [];

	for (let i = 0; i<decodImg.length;i++){
		array.push(decodImg.charCodeAt(i));
	}

	const file = new Bolb([new Uint8Array(array)],{type:'image/jpeg'});
	const fileName = 'dog_img+' + new Date().getMilliseconds() + '.jpg';
	let formData = new FormData();
	formData.append('file',file,fileName);

	$.ajax({
		type: 'post',
		url:'/upload/',
		cache: false,
		data: formData,
		processData: false,
		contentType:false,
		success: function(data){
			alert('Uploaded !!')
		}
	})


	var a = document.createElement("a");
	a.href = dataURL;
	a.download = now + ".jpg";
	document.body.appendChild(a);
	a.click();
});

// 시계
function printClock() {
	var clock = document.getElementById("clock");
	var currentDate = new Date();
	var calendar = currentDate.getFullYear() + "년 " + (currentDate.getMonth() + 1) + "월 " + currentDate.getDate() + "일"; // 현재 날짜
	var amPm = "오전";
	var currentHours = addZeros(currentDate.getHours(), 2);
	var currentMinute = addZeros(currentDate.getMinutes(), 2);
	var currentSeconds = addZeros(currentDate.getSeconds(), 2);
	var currentTime = currentHours + ":" + currentMinute + ":" + currentSeconds;

	if (currentHours >= 12) {
		amPm = "오후";
		currentHours = addZeros(currentHours - 12, 2);
	}

	clock.innerHTML = calendar + " " + amPm + " " + currentTime; // 날짜, 시간 출력

	setTimeout("printClock()", 1000); // 1초마다 printClock() 호출
}

// 자릿수 맞춤 (ex. 5 -> 05)
function addZeros(num, digit) {
	var zero = "";
	num = num.toString();
	if (num.length < digit) {
		for (i = 0; i < digit - num.length; i++) {
			zero += "0";
		}
	}
	return zero + num;
}
