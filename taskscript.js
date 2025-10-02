document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();

    if (name === "" || email === "" || message === "") {
        alert("Please fill all fields!");
        return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid email!");
        return;
    }
    alert("Form submitted successfully!");
    this.reset();
});

document.getElementById("addTodoBtn").addEventListener("click", function() {
    let input = document.getElementById("todoInput");
    let task = input.value.trim();
    if (task === "") return;

    let li = document.createElement("li");
    li.textContent = task;

    let delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = function() {
        li.remove();
    };

    li.appendChild(delBtn);
    document.getElementById("todoList").appendChild(li);
    input.value = "";
});
