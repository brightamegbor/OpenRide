class LocalStorage {
    saveUserForm(name, data) {
        localStorage.setItem(name, JSON.stringify(data));
    };

    getUserForm(name) {
        const savedForm = localStorage.getItem(name);
        return JSON.parse(savedForm);
    }

    saveBool(boolName, data) {
        localStorage.setItem(boolName, data);
    }

    getBool(boolName) {
        let boolVal = localStorage.getItem(boolName);
        return JSON.parse(boolVal);
    }
}


export default new LocalStorage();
