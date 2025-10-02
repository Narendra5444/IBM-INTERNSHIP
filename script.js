function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function toggleMenu() {
  document.querySelector(".nav").classList.toggle("open");
}

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

function handleContact(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());

  const note = document.getElementById("formNote");
  note.textContent = "Thanks, " + data.name + "! Your Message Was Noted. We Will Contact you soon!";

  const messages = JSON.parse(localStorage.getItem("messages") || "[]");
  messages.push({ ...data, at: new Date().toISOString() });
  localStorage.setItem("messages", JSON.stringify(messages));

  form.reset();
  return false;
}
function openProject(page) {
  window.location.href = page;

}