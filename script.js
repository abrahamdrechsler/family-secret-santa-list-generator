document.addEventListener("DOMContentLoaded", () => {
    const members = [];
    const memberList = document.getElementById("members");
    const resultsList = document.getElementById("results");

    // Add a family member
    document.getElementById("add-member").addEventListener("click", () => {
        const name = document.getElementById("name").value.trim();
        const group = document.getElementById("group").value.trim();

        if (name && group) {
            members.push({ name, group }); // Add the new member to the array
            updateMemberList(); // Update the displayed list
            document.getElementById("name").value = ""; // Clear input fields
            document.getElementById("group").value = ""; // Clear input fields
        } else {
            alert("Please enter both name and group!"); // Validation alert
        }
    });

    // Update the list of members
    function updateMemberList() {
        memberList.innerHTML = members.map(
            (member, index) => `
                <li>
                    <div class="details">${member.name} (${member.group})</div>
                    <button onclick="editMember(${index})">Edit</button>
                    <button onclick="removeMember(${index})">Remove</button>
                </li>
            `
        ).join("");
    }

    // Remove a member
    window.removeMember = (index) => {
        members.splice(index, 1); // Remove the selected member
        updateMemberList(); // Refresh the list
    };

    // Edit a member
    window.editMember = (index) => {
        const member = members[index];
        const newName = prompt("Edit Name:", member.name);
        const newGroup = prompt("Edit Group:", member.group);

        if (newName !== null && newGroup !== null) {
            members[index] = { name: newName.trim() || member.name, group: newGroup.trim() || member.group };
            updateMemberList(); // Refresh the list after editing
        }
    };

    // Generate Secret Santa list
    document.getElementById("generate-list").addEventListener("click", () => {
        const preventSameGroup = document.getElementById("prevent-same-group").checked;

        if (members.length < 2) {
            alert("You need at least two members to generate a Secret Santa list!");
            return;
        }

        const pairs = generateSecretSanta(members, preventSameGroup);
        if (pairs) {
            displayResults(pairs);
        } else {
            alert("Could not generate Secret Santa pairs with the given constraints.");
        }
    });

    // Generate pairs
    function generateSecretSanta(members, preventSameGroup) {
        const unassigned = [...members];
        const assignments = new Map();

        for (const giver of members) {
            const possibleRecipients = unassigned.filter((recipient) => {
                return recipient.name !== giver.name && // Ensure no self-assignment
                    (!preventSameGroup || recipient.group !== giver.group);
            });

            if (possibleRecipients.length === 0) {
                return null; // Failed to assign due to constraints
            }

            const recipient = possibleRecipients[Math.floor(Math.random() * possibleRecipients.length)];
            assignments.set(giver.name, recipient.name);
            unassigned.splice(unassigned.indexOf(recipient), 1);
        }

        return assignments;
    }

    // Display results
    function displayResults(pairs) {
        resultsList.innerHTML = "";
        pairs.forEach((recipient, giver) => {
            resultsList.innerHTML += `<li>${giver} → ${recipient}</li>`;
        });
    }
});
