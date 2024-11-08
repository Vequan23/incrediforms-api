interface CreateFieldDto {
  form_id: string;
  label: string;
  required: boolean;
  order: number;
  name: string;
  type: string;
}


interface UpdateFieldDto extends CreateFieldDto { }

export { CreateFieldDto, UpdateFieldDto };
