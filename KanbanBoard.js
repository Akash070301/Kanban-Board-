//Add button - Modal Toggling
const addButton = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const mainCont = document.querySelector(".main-cont");
const taskArea = document.querySelector(".textbox-area");


//Get Tickets from Storage
let ticketsArr = []
if(localStorage.getItem('ticketObjects')){
    let stringifyArr = localStorage.getItem('ticketObjects')
    let arr = JSON.parse(stringifyArr)
    for(let i=0; i<arr.length; ++i){
       let localTicket = arr[i]
       createTicket(localTicket.id,localTicket.task,localTicket.color)
    }

}

let modalDisplay = false;
addButton.addEventListener("click", function () {
  if (modalDisplay) {
    modalCont.style.display = "none";
    addButton.style.color = 'inherit'
  } else {
    modalCont.style.display = "flex";
    addButton.style.color = 'green'
    taskArea.value = "";
  }
  modalDisplay = !modalDisplay;
});

//Colour Select
const allColorSelect = document.querySelectorAll(".color-select");
let userPriColor = "pink";
for (let i = 0; i < allColorSelect.length; ++i) {
  allColorSelect[i].addEventListener("click", function (e) {
    for (let j = 0; j < allColorSelect.length; ++j) {
      if (allColorSelect[j].classList.contains("active")) {
        allColorSelect[j].classList.remove("active");
      }
    }
    e.target.classList.add("active");
    userPriColor = e.target.classList[1];
  });
}
//Generate Ticket
taskArea.addEventListener("keydown", function (e) {
  if (e.key == "Tab") {
    modalCont.style.display = "none";
    addButton.style.color = 'inherit'
    modalDisplay = false;
    const task = taskArea.value;
    createTicket(undefined,task,userPriColor);
    taskArea.value = "";
  }
});

function createTicket(ticektId,task,priorityColor) {
    if(task==""){
        alert('please add task')
        return;
    }
    let id
    if(ticektId){
        id = ticektId
    }
    else{
        id = shortid()
    }
  const ticket = document.createElement("div");
  ticket.className = "ticket-cont";
  ticket.innerHTML = `<div class="ticket-color ${priorityColor}"></div>
                   <div class="ticket-id">${id}</div>
                   <div class="task-area">${task}</div>
                   <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>`;
  mainCont.appendChild(ticket);
  //Local Storage
  let ticketsObj = {id:id, task:task,color:priorityColor}
  ticketsArr.push(ticketsObj)
  updateStorage()

  ticket.addEventListener("click", function () {
    if (delBtnActive) {
      ticket.remove();
      let delIdx = ticketsArr.findIndex(function(ticketObjects){
        return ticketObjects.id == id;
      })
      ticketsArr.splice(delIdx,1)
      updateStorage()
      
    }
  });
  //Change Priority
  const colorsArr = ["red", "blue", "green", "pink"];
  const ticketColor = ticket.querySelector(".ticket-color");
  ticketColor.addEventListener("click", function (e) {
    let classColor = e.target.classList[1];
    e.target.classList.remove(classColor);
    let curColorIdx = colorsArr.indexOf(classColor);
    let nextColorIdx = (curColorIdx + 1) % colorsArr.length;
    e.target.classList.add(colorsArr[nextColorIdx]);
    let colorIdx = ticketsArr.findIndex(function(ticketObjects){
        return ticketObjects.id == id;
      })

    ticketsArr[colorIdx].color = colorsArr[nextColorIdx]
    updateStorage()
  })


  
  //Lock Function
  let locked = "fa-lock";
  let unlocked = "fa-unlock";
  const lockEle = ticket.querySelector(".ticket-lock");
  const lockIcon = lockEle.children[0];
  const taskEdit = ticket.querySelector(".task-area");
  lockIcon.addEventListener("click", function () {
    if (lockIcon.classList.contains(locked)) {
      lockIcon.classList.remove(locked);
      lockIcon.classList.add(unlocked);
      taskEdit.setAttribute("contenteditable", "true");
    } else {
      lockIcon.classList.remove(unlocked);
      lockIcon.classList.add(locked);
      taskEdit.setAttribute("contenteditable", "false");
      let editIdx = ticketsArr.findIndex(function(ticketObjects){
        return ticketObjects.id == id
      })
      ticketsArr[editIdx].task = taskEdit.innerText
      console.log(ticketsArr)
      updateStorage()
    }
  })
}
//Delete Ticket
const delBtn = document.querySelector(".del-btn");
let delBtnActive = false;
delBtn.addEventListener("click", function () {
  if (delBtnActive) {
    delBtn.style.color = "#012001";
  } else {
    delBtn.style.color = "red";
  }
  delBtnActive = !delBtnActive;
});

//Ticket Filtering
const toolbarPriority = document.querySelectorAll(".priority-color");
for (let i = 0; i < toolbarPriority.length; ++i) {
  toolbarPriority[i].addEventListener("click", function (e) {
    let selectedColor = e.target.classList[1];
    const allTicketPriority = document.querySelectorAll(".ticket-color");
    for (let j = 0; j < allTicketPriority.length; ++j) {
      let ticketColor = allTicketPriority[j].classList[1];
      if (selectedColor == ticketColor) {
        allTicketPriority[j].parentElement.style.display = "block";
      } else {
        allTicketPriority[j].parentElement.style.display = "none";
      }
    }
  });

  toolbarPriority[i].addEventListener("dblclick", function () {
    const allTickets = document.querySelectorAll(".ticket-cont");
    for (let j = 0; j < allTickets.length; ++j) {
      allTickets[j].style.display = "block";
    }
  });
}



//Update Storage
function updateStorage(){
    let stringifiedTickets = JSON.stringify(ticketsArr)
    localStorage.setItem('ticketObjects',stringifiedTickets)
}