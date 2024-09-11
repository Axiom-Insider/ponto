const checkboxes = document.querySelectorAll('#opcao');
const checkbox1 = document.querySelectorAll('#opcaoH')

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      checkboxes.forEach(otherCheckbox => {
        if (otherCheckbox !== checkbox) {
          otherCheckbox.checked = false;
        }
      });
    }
  });
});


