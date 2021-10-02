export const saveUserForm = (name, data) => {
    localStorage.setItem(name, JSON.stringify(data));
};

export function getUserForm(name) {
    const savedForm = localStorage.getItem(name);
    return JSON.parse(savedForm);
}
