# Rota de Detalhes da Clínica

## Endpoint
`GET /clinics/:id`

## Descrição
Retorna os detalhes não sensíveis de uma clínica específica baseado no ID.

## Parâmetros
- `id` (number): ID da clínica a ser consultada

## Resposta de Sucesso (200)
```json
{
  "message": "Detalhes da clínica recuperados com sucesso.",
  "data": {
    "id": 1,
    "name": "Clínica Exemplo",
    "phone": "11987654321",
    "cellPhone": "11987654321",
    "whatsapp": "11987654321",
    "hasNumber": true,
    "houseNumber": "123",
    "email": "clinica@exemplo.com",
    "cnpj": "12345678000123",
    "address": "Rua Exemplo, 123",
    "cep": "01234567",
    "city": "São Paulo",
    "state": "SP",
    "neighborhood": "Centro",
    "complement": "Sala 101",
    "latitude": -23.5505,
    "longitude": -46.6333,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "specialty": [
      {
        "id": 1,
        "value": "cardiology",
        "label": "Cardiologia"
      }
    ],
    "healthInsurance": [
      {
        "id": 1,
        "value": "unimed",
        "label": "Unimed"
      }
    ]
  }
}
```

## Respostas de Erro

### 404 - Clínica não encontrada
```json
{
  "message": "Clínica não encontrada."
}
```

### 400 - ID inválido
```json
{
  "message": "Formato de ID da clínica inválido.",
  "errors": [...]
}
```

### 500 - Erro interno
```json
{
  "message": "Erro interno do servidor."
}
```

## Campos Excluídos (por segurança)
Os seguintes campos são excluídos da resposta por conterem informações sensíveis:
- `password_hash`
- `isAuthenticated`

## Exemplo de Uso
```bash
curl -X GET http://localhost:3333/clinics/1
```
