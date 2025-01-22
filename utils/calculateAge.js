function calculateAge(dob) {
  const today = new Date();
  const birthDate = new Date(dob); // Convert the input DOB into a Date object
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // If the current month and day is before the birth month and day, subtract one from the age
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

module.exports = calculateAge;