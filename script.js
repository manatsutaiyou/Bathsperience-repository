// Handle burger menu for small screens
document.querySelector('.burger-menu').addEventListener('click', function() {
  document.querySelector('.menu').classList.toggle('open');
});

// Handle submenus
const menuItems = document.querySelectorAll('.menu > li.has-submenu > a');

menuItems.forEach(item => {
  item.addEventListener('mouseover', () => {
    const submenu = item.nextElementSibling;
    submenu.style.display = 'block';
    submenu.style.transform = 'scaleY(1)';
  });

  item.addEventListener('mouseout', () => {
    const submenu = item.nextElementSibling;
    submenu.style.display = 'none';
    submenu.style.transform = 'scaleY(0)';
  });
});
