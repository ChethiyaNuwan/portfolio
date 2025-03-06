export const triggerTemplateEmail = (email: string) => {
    const subject = "Schedule a Call";
    const body = "Hi, I'd like to schedule a call.";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, "_blank");
};