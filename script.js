const quoteForm = document.querySelector("#quote-form");
const formStatus = document.querySelector("#form-status");
const printHeadings = document.querySelectorAll(".print-heading");

document.documentElement.classList.add("js");

printHeadings.forEach((heading) => {
  heading.dataset.text = heading.textContent;
  heading.addEventListener("animationend", (event) => {
    if (event.animationName === "printText") {
      heading.classList.add("is-printed");
    }
  });
});

function startPrinting(heading) {
  if (!heading.classList.contains("is-printing")) {
    heading.classList.add("is-printing");
    window.setTimeout(() => {
      heading.classList.add("is-printed");
    }, 1500);
  }
}

if ("IntersectionObserver" in window) {
  const headingObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        startPrinting(entry.target);
        headingObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.01
  });

  printHeadings.forEach((heading) => headingObserver.observe(heading));

  requestAnimationFrame(() => {
    printHeadings.forEach((heading) => {
      const box = heading.getBoundingClientRect();

      if (box.top < window.innerHeight && box.bottom > 0) {
        startPrinting(heading);
        headingObserver.unobserve(heading);
      }
    });
  });
} else {
  printHeadings.forEach(startPrinting);
}

if (quoteForm && formStatus) {
  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = quoteForm.querySelector("button[type='submit']");
    const formData = new FormData(quoteForm);
    const originalText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    formStatus.className = "form-status full";
    formStatus.textContent = "";

    try {
      const response = await fetch(quoteForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Unable to send quote request.");
      }

      quoteForm.reset();
      formStatus.classList.add("success");
      formStatus.textContent = "Thanks. Your quote request was sent. I will reply by email.";
    } catch (error) {
      formStatus.classList.add("error");
      formStatus.textContent = "Sorry, the form could not send right now. Please email Devpatel0276@gmail.com directly.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}
