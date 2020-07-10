

export function createGui (level, originalLevel, isSolved) {

    const wrapper = createElement("div", undefined, "sudoku-wrapper");

    //create fields
    for (let row = 0; row < level.length; row++) {
        for (let col = 0; col < level[row].length; col++) {
            const value = level[row][col];
            const originalValue = originalLevel ? originalLevel[row][col] : value;

            const color = isSolved ? 'green' : 'red';

            wrapper.appendChild(
                createElement("div", value, `field ${value !== originalValue ? color : ''}`)
            );
        }
    }

    //create boxes (3x3 grid)
    const boxWrapper = createElement("div", undefined, "box-wrapper");
    for (let i = 0; i < 9; i++) {
        boxWrapper.appendChild(
            createElement("div", undefined, `box`)
        );
    }
    wrapper.appendChild(boxWrapper);

    wrapper.appendChild(createElement("div", undefined, "clearfix"));

    return wrapper;
}

const createElement = (tag, value, className) => {
    const element = document.createElement(tag);
    if (value) {
        element.innerText = value;
    }

    if (className) {
        element.setAttribute("class", className);
    }

    return element;
};

export const removeChildren = element => {
    while (element.firstChild) {
        element.firstChild.remove();
    }
};