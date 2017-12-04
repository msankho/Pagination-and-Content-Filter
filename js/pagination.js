const pageHeaderDiv = document.querySelector('.page-header');
const studentList = document.querySelector('.student-list');
const students = studentList.querySelectorAll('li');
const pageDiv = document.querySelector('.page');
const students_per_page = 10;
let current_page = 1;


// Function to create the pagination links

function create_pagination_links(total_students){

	let total_pages = Math.ceil(total_students/students_per_page);
	let paginationDiv = document.createElement('div');
	let pageUL = document.createElement('ul');
	paginationDiv.className = 'pagination';

	for(let i = 0; i < total_pages; i++) {

		let li = document.createElement('li');
		let a = document.createElement('a');
		let pageNumber = document.createTextNode(i+1);
		a.appendChild(pageNumber);
		a.href = '#';
		li.appendChild(a);
		pageUL.appendChild(li);
	}

	paginationDiv.appendChild(pageUL);
	pageDiv.appendChild(paginationDiv);
	set_active_link(0, current_page);

	return paginationDiv;

}

// hide students from last page before displaying the current page.

function hide_students (last_page, students_to_display){
	let total_students = students_to_display.length;


	if(last_page == 0) { // Hide all students
		hide_offset = 0;
		total_to_hide = total_students;
	} else { // Hide students from the last page
		hide_offset = (last_page - 1) * students_per_page;
		hide_offset + students_per_page <= total_students ? total_to_hide = students_per_page : total_to_hide = total_students - hide_offset;
	}

	for(let i=hide_offset; i < hide_offset + total_to_hide; i++){
		students_to_display[i].style.display = 'none';
	}
}

// Display students from the page clicked

function display_students(current_page, students_to_display) {

	let total_students = students_to_display.length;

	let offset = (current_page - 1) * students_per_page;
	offset + students_per_page <= total_students ? numberOfStudentsToDisplay = students_per_page : numberOfStudentsToDisplay = total_students - offset ;

	for(let i=offset; i < offset + numberOfStudentsToDisplay; i++){
		students_to_display[i].style.display = 'block';
	}
}

// Set the current page link as active and deactivate the last page link

function set_active_link(last_page, current_page){
	let paginationDiv = document.querySelector('.pagination');
	let pageUL = paginationDiv.querySelector('ul');
	if(last_page) pageUL.children[last_page-1].querySelector('a').classList.remove('active');
	pageUL.children[current_page - 1].querySelector('a').className = 'active';
}

// return the list of students based on search field

function search_students(search_term, students_to_search){

	let total_students = students_to_search.length;
	let searched_students = [];
	for(let i = 0; i < total_students; i++){
		let student_name = students_to_search[i].querySelector('h3').textContent;
		let student_email = students_to_search[i].querySelector('.email').textContent;
		console.log(student_email);
		if(student_name.includes(search_term) || student_email.includes(search_term)) {
			searched_students.push(students_to_search[i]);
		}

	}

	return searched_students;
}

// Create pagination links if total number of students is more than students_per_page

function create_page(current_page, students_to_display){
	
	let total_students = students_to_display.length;

	// if the pagination div exists, remove it.
	let paginationDiv = document.querySelector('.pagination');
	if(paginationDiv) {
		paginationDiv.parentNode.removeChild(paginationDiv);
	}

	// add pagination links if the total number of students is more than students per page.
	if(total_students > students_per_page) {

		let paginationDiv = create_pagination_links(total_students);

		// add event listener to all the pagination links
		paginationDiv.addEventListener('click', (event) => {
			let link = event.target;
			if(link.tagName == 'A'){
				last_page = current_page;
				current_page = parseInt(link.textContent);
				hide_students(last_page, students_to_display);
				display_students(current_page, students_to_display);
				set_active_link(last_page, current_page);
			}
		});

	} 
}

// Do this when the page first loads

function load_page_first_time() {
	hide_students(0, students); // hide all students first
	display_students(1, students); // display 1st 10 students on page 1
	create_page(current_page, students);
}

// Dynamically add the search field 

function create_search_div() {
	const searchDiv = document.createElement('div');
	const input = document.createElement('input');
	const search_button = document.createElement('button');

	searchDiv.className = 'student-search';
	input.placeholder = 'Search for students...';
	search_button.textContent = 'Search';

	searchDiv.appendChild(input);
	searchDiv.appendChild(search_button);

	pageHeaderDiv.appendChild(searchDiv);
	return search_button;
}

load_page_first_time();
const search_button = create_search_div();

// add event listener for the search field

search_button.addEventListener('click', (event) => {

	// Get a list of students that match search value
	let input = document.querySelector('.student-search input');
	let searched_students = search_students(input.value, students);
	hide_students(0, students);

	// Remove the message if exists already
	let errorMessage = document.querySelector('.error-message');
	if(errorMessage){
		errorMessage.parentNode.removeChild(errorMessage);
	}

	// Remove the search results header if exists already
	let searchHeader = document.querySelector('.search-header');
	if(searchHeader) {
		searchHeader.parentNode.removeChild(searchHeader);
	}

	// if no students were found matching the input field, then display an error.
	if(searched_students.length == 0){
		let error = document.createElement('p');
		error.textContent = 'Sorry no students with name ' + input.value + ' were found!';
		error.className = 'error-message';
		pageDiv.appendChild(error);

	}

	// Create a new search header
	let newSearchHeader = document.createElement('div');
	newSearchHeader.className = 'search-header';
	let p = document.createElement('p');


	// Display the search header only if the input is not empty
	if(input.value){
		let searchMessage = 'Search Results for ' + input.value;
		p.textContent = searchMessage;
		newSearchHeader.appendChild(p);
		pageDiv.insertBefore(newSearchHeader, studentList);
	}

	display_students(1, searched_students);
	create_page(current_page, searched_students);

});
