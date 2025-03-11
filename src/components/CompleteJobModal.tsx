import { useState, useRef } from 'react';
import styled from 'styled-components';
import { completeJob } from '../services/db';

interface CompleteJobModalProps {
  accountId: string;
  boosterId: string;
  onClose: () => void;
  onCompleteSuccess: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 1.25rem 1.5rem;
  
  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.375rem;
  font-size: 1rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px dashed #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
    background-color: rgba(59, 130, 246, 0.05);
  }
`;

const FilePreview = styled.div`
  margin-top: 1rem;
  width: 100%;
  
  img {
    max-width: 100%;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  background-color: ${(props) => 
    props.variant === 'primary' ? '#3b82f6' : 
    props.variant === 'secondary' ? '#9ca3af' : 
    props.variant === 'danger' ? '#ef4444' : '#3b82f6'};
  
  color: white;
  
  &:hover {
    background-color: ${(props) => 
    props.variant === 'primary' ? '#2563eb' : 
    props.variant === 'secondary' ? '#6b7280' : 
    props.variant === 'danger' ? '#dc2626' : '#2563eb'};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Error = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

// Lista de elos
const elos = [
  'FERRO',
  'BRONZE',
  'PRATA',
  'OURO',
  'PLATINA',
  'ESMERALDA',
  'DIAMANTE',
  'MESTRE'
];

// Lista de tiers
const tiers = ['I', 'II', 'III', 'IV'];

const CompleteJobModal: React.FC<CompleteJobModalProps> = ({ 
  accountId, 
  boosterId, 
  onClose, 
  onCompleteSuccess 
}) => {
  const [finalElo, setFinalElo] = useState('OURO');
  const [finalTier, setFinalTier] = useState('IV');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFilePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleClickFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!finalElo || !finalTier) {
      setError('Por favor, selecione o elo e divisão final alcançados.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Simulando o upload do arquivo (se necessário)
      if (uploadedFile) {
        // Em produção, aqui você faria upload do arquivo para um serviço de armazenamento
        // Como o Supabase Storage, AWS S3, etc. e obteria a URL
        
        // Simulando o upload
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      await completeJob(accountId, boosterId, finalElo, finalTier);
      onCompleteSuccess();
    } catch (err) {
      console.error('Erro ao finalizar job:', err);
      setError('Não foi possível finalizar o job. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h3>Finalizar Conta</h3>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Elo Final</Label>
              <Select 
                value={finalElo}
                onChange={(e) => setFinalElo(e.target.value)}
                required
              >
                {elos.map((elo) => (
                  <option key={elo} value={elo}>{elo}</option>
                ))}
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Divisão Final</Label>
              <Select 
                value={finalTier}
                onChange={(e) => setFinalTier(e.target.value)}
                required
              >
                {tiers.map((tier) => (
                  <option key={tier} value={tier}>{tier}</option>
                ))}
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>Print do LoL (opcional)</Label>
              <FileInputLabel onClick={handleClickFileInput}>
                {filePreview ? (
                  <FilePreview>
                    <img src={filePreview} alt="Screenshot Preview" />
                  </FilePreview>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#6b7280" viewBox="0 0 16 16">
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                      <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                    </svg>
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                      <p style={{ color: '#4b5563', margin: '0' }}>Clique para fazer upload de um screenshot</p>
                      <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: '0.5rem 0 0' }}>PNG, JPG ou JPEG</p>
                    </div>
                  </>
                )}
              </FileInputLabel>
              <FileInput 
                type="file" 
                ref={fileInputRef} 
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
              />
            </FormGroup>
            
            {error && <Error>{error}</Error>}
            
            <ButtonGroup>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Finalizando...' : 'Finalizar Conta'}
              </Button>
            </ButtonGroup>
          </Form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CompleteJobModal;
