# sh-frontend

- [ ] Criar tela de Reset de senha
- [ ] Adicionar suporte a paginação para tarefas e comodos
- [ ] invalidar query de get current zone, aorenomear uma zone
- [ ] ao reiniciar a pagina, botasr um loading, ate que tenha sido verificado que não há usuario para login
- [ ] loading tambem antes de carregar as tarefas
- [ ] quando uma convidado na household marca ou desmarca uma tarefa, demora a aparecer para os outros existe alguma forma de fazer um invalidated queries ou algo assim, para sempre que uma task for marcada ou desmarcada as tasks para aquela id de household fossem atualizadas com uma nova consulta?
- [ ] melhorar UI
- [ ] Criarmodal de confirmação de remoção de usuárioo da lista
- [ ] verificar demora na toglle das tasks
- [ ] Ao criar uma tarefa dentro de uma zona,a zona não recarrega com a nova tarefa (invalidet query??)
- [ ] Tela de zona especifica deve aparecer todas as tarefas relacionadas independe do tipo
- [ ] ao consoluir uma tarefa a consulta do nome deve ser feita para exibir a ultima pessoa que consluiu a tarfea
- [ ]UPdate toggle task to new table
// Mark as completed
POST /households/{id}/tasks/{task_id}/execute
{ "notes": "Done!" }

// Unmark (undo)
POST /households/{id}/tasks/{task_id}/unmark
{}

// Check state
GET /households/{id}/tasks/{task_id}
// Response includes: is_available, last_completion
POST /households/{id}/tasks/{task_id}/unmark

--- {
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Clean Kitchen",
  "type": "daily",
  "last_execution": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "task_id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "550e8400-e29b-41d4-a716-446655440002",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "execution_date": "2024-01-15",
    "executed_at": "2024-01-15T10:30:00Z"
  }
}---

