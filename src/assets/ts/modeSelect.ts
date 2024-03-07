document.addEventListener('DOMContentLoaded', () => {
    const items: NodeListOf<HTMLDivElement> = document.querySelectorAll('.gamemode');
    let currentIndex: number = 0;
  
    // Function to show the current item and hide the rest
    function showCurrentItem(): void {
      items.forEach((item: HTMLDivElement, index: number) => {
        if (index === currentIndex) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }
  
    // Show the initial item
    showCurrentItem();
  
    // Event listener for the previous button
    document.getElementById('prev-btn')?.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      showCurrentItem();
    });
  
    // Event listener for the next button
    document.getElementById('next-btn')?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % items.length;
      showCurrentItem();
    });
  });
  