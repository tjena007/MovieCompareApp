const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
	root.innerHTML = `
        <label><b>Search Here... </b></label>
        <input type="text" class="input"/>
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results">
                    
                </div>
            </div>
        </div>
    `;
	const input = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultswrapper = root.querySelector('.results');

	const onInput = async (event) => {
		const items = await fetchData(event.target.value);

		if (!items.length) {
			dropdown.classList.remove('is-active');
			return;
		}
		resultswrapper.innerHTML = '';
		dropdown.classList.add('is-active');
		for (const item of items) {
			const option = document.createElement('a');
			option.classList.add('dropdown-item');

			option.innerHTML = renderOption(item);

			resultswrapper.appendChild(option);

			option.addEventListener('click', (e) => {
				input.value = inputValue(item);
				dropdown.classList.remove('is-active');
				onOptionSelect(item);
			});
		}
	};
	input.addEventListener('input', debounce(onInput, 500));

	document.addEventListener('click', (event) => {
		if (!root.contains(event.target)) {
			dropdown.classList.remove('is-active');
		}
	});
};
