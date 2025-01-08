const countrySelect = document.querySelector("#country");
const stateSelect = document.querySelector("#stateOfOrigin");

const updateStateSelect = () => {
  const allStates = states?.filter(
    (currentSate) => currentSate.countryCode === countrySelect.value
  );

  stateSelect.disabled = false;
  stateSelect.innerHTML = "";
  allStates.forEach((state) => {
    const option = document.createElement("option");
    option.value = state.name;
    option.text = state.name;
    if (form.stateOfOrigin === state.name) option.selected = true;
    stateSelect.appendChild(option);
  });
};

if (form !== "" && states !== "") updateStateSelect();
countrySelect.addEventListener("change", updateStateSelect);
