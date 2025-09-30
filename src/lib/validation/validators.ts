export const validateEmail = (email: string): string | null => {
    if(!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(email)) return 'Invalid email format';
    return null;
};

export const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    return null;
};

export const validateUsername  = (username: string): string | null => {
    if (!username) return 'Username is required';
    if (username.length < 3 || username.length > 20) return 'Username must be between 3 and 20 characters';
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return null;
};

export const validateTitle = (title: string): string | null => {
    if (!title) return 'Title is required';
    if (title.length < 5 || title.length > 100) return 'Title must be between 5 and 100 characters';
    return null; 
};

export const validateDescription = (description: string): string | null => {
    if (!description) return 'Description is required';
    if (description.length < 10) return 'Description must be at least 10 characters';
    return null;
};
