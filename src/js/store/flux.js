const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			contacts: [] // lista donde se guardan los contactos
		},  
		actions: {
			
			// Obtener contactos de la API
			obtenerContacts: () => {
				fetch('https://playground.4geeks.com/contact/agendas/brunnarayssa/contacts', {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				})
				.then((response) => response.json())
				.then((data) => {
					console.log("Datos recibidos de la API:", data);
					if (Array.isArray(data.contacts)) {
						setStore({ contacts: data.contacts }); //guarda los contactos en el store
					} else {
						setStore({ contacts: [] });//si la API no devuelve un array válido, pone contacts como un array vacio.
					}
				})
			},

			// Agregar contacto al store localmente
			addContactToContacts: (contact) => {
				const store = getStore();
				setStore({ contacts: [...store.contacts, contact] });
			},

			// Crear un contacto en la API
			createContact: (payload) => {
				fetch("https://playground.4geeks.com/contact/agendas/brunnarayssa/contacts", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ ...payload, agenda_slug: "brunnarayssa" }), // incluimos agenda_slug
				})
				.then((response) => response.json())
				.then((data) => {
					const actions = getActions();
					actions.addContactToContacts(data);
					console.log("Contacto agregado:", data);
				})
				.then(() => {
					getActions().obtenerContacts(); // vuelve a obtener todos los contactos desde la API 
				})
			},

			// Eliminar contacto
			deleteContact: (id) => {
				fetch(`https://playground.4geeks.com/contact/agendas/brunnarayssa/contacts/${id}`, {
					method: "DELETE",
					headers: { "Content-Type": "application/json" }
				})
				.then(() => {
					//actualizar el store local para eliminar el contacto de la lista
					const store = getStore();
					const updatedContacts = store.contacts.filter(contact => contact.id !== id);
					setStore({ contacts: updatedContacts });
					console.log(`Contacto con ID ${id} eliminado`);
				})
				.then(() => {
					getActions().obtenerContacts(); // después de eliminar, actualiza la lista desde la API
				});
			},

			// Editar un contacto
			changeContact: (id, updatedContact) => {
				fetch(`https://playground.4geeks.com/contact/agendas/brunnarayssa/contacts/${id}`, {
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ ...updatedContact, agenda_slug: "brunnarayssa" }) // aseguramos que se mantenga en la agenda
				})
				.then((response) => response.json())
				.then((data) => {
					const store = getStore();
					const newContacts = store.contacts.map(contact => 
						contact.id === parseInt(id) ? data : contact
					);
					setStore({ contacts: newContacts });
					console.log(`Contacto con ID ${id} actualizado`);
				})
			},
		}
	};
};

export default getState;
