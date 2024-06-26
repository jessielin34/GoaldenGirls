// document.addEventListener('DOMContentLoaded', function() {
//     const navbar = document.querySelector('.navbar');
//     const links = document.querySelectorAll('.navbar a'); // Select all navbar links
//     const sections = document.querySelectorAll('.section'); // Select all sections
//     const offsetTop = navbar.offsetTop;
//     const navbarWidth = navbar.offsetWidth; // Store the initial width of the navbar

//     function onScroll() {
//         let scrollPosition = window.pageYOffset;

//         // Check which section is currently in view and update navbar links
//         sections.forEach((section) => {
//             if (scrollPosition >= section.offsetTop - navbar.offsetHeight && scrollPosition < section.offsetTop + section.offsetHeight) {
//                 links.forEach((link) => {
//                     link.classList.remove('active');
//                     if (section.id === link.getAttribute('href').substring(1)) {
//                         link.classList.add('active');
//                     }
//                 });
//             }
//         });

//         // Make navbar fixed when scrolling past its initial position
//         if (scrollPosition >= offsetTop) {
//             navbar.classList.add('fixed-navbar');
//             navbar.style.width = `${navbarWidth}px`; // Set width to the initial width
//         } else {
//             navbar.classList.remove('fixed-navbar');
//             navbar.style.width = ''; // Reset the width style
//         }
//     }

//     // Add click event to links to handle manual activation
//     links.forEach(link => {
//         link.addEventListener('click', function(e) {
//             e.preventDefault(); // Prevent default anchor click behavior
//             const sectionId = this.getAttribute('href').substring(1);
//             const section = document.getElementById(sectionId);
//             window.scrollTo({
//                 top: section.offsetTop - navbar.offsetHeight,
//                 behavior: 'smooth'
//             });
//         });
//     });

//     window.addEventListener('scroll', onScroll);
// });


document.addEventListener("DOMContentLoaded", function () {
    function updateCheckpointMargins() {
        var timelines = document.querySelectorAll('.mini-timeline'); // Select all mini-timeline elements
        timelines.forEach(function (container) { // Process each timeline individually
            var checkpoints = container.querySelectorAll('.checkpoint');
            var baseMargin = 75; // Base margin for 6 checkpoints
            var numberOfCheckpoints = checkpoints.length;
            var marginDifference = 6 - numberOfCheckpoints; // Difference from base number of checkpoints
            var currentMargin = baseMargin + (marginDifference * 10);

            checkpoints.forEach(function (checkpoint, index) {
                // Apply equal margin on both sides for each checkpoint except the last
                checkpoint.style.marginRight = index !== checkpoints.length - 1 ? currentMargin + 'px' : '0px';
                checkpoint.style.marginLeft = currentMargin + 'px';
            });

            // Remove left margin of the first checkpoint to maintain center alignment
            if (checkpoints.length > 0) {
                checkpoints[0].style.marginLeft = '0px';
            }
        });
    }

    updateCheckpointMargins();
    window.addEventListener('resize', updateCheckpointMargins); // Adjust margins on window resize
});
