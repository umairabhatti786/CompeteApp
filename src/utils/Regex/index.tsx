export const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,4}$/;
export const numericRegex = /^[0-9]+$/;
export const phoneRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?|\+44\s?1\d{1,3}|\(?01\d{1,3}\)?|\+44\s?2\d{1,3}|\(?02\d{1,3}\)?)\s?\d{3,4}\s?\d{3,4}$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
export const htmlTagRegex = /<\/?[^>]+(>|$)/g;
