const quoteForm = document.querySelector("#quote-form");
const formStatus = document.querySelector("#form-status");

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
