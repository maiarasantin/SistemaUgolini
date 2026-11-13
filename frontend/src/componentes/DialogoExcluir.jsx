import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

const VERDE = "#2f5a45";
const LARANJA = "#e8895a";

export default function DialogoExcluir({ aberto, nomeItem, excluindo, aoCancelar, aoConfirmar }) {
    return (
        <Dialog
            open={aberto}
            onClose={excluindo ? undefined : aoCancelar}
            maxWidth="xs"
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: 3, backgroundColor: "#fffdf8" } } }}
        >
            <DialogContent>
                {/* cirrculo laranja com a lixeira */}
                <Avatar sx={{ bgcolor: LARANJA, width: 40, height: 40, mb: 2 }}>
                    <DeleteOutlineIcon />
                </Avatar>

                <Typography variant="h6" sx={{ color: VERDE, mb: 1 }}>
                    Confirmar exclusão
                </Typography>

                <Typography color="text.secondary">
                    Tem certeza que deseja excluir <strong>{nomeItem}</strong>?
                </Typography>
            </DialogContent>

            {/* faixa de botões lá embaixo da janela */}
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={aoCancelar} disabled={excluindo} sx={{ color: VERDE }}>
                    Cancelar
                </Button>

                <Button
                    onClick={aoConfirmar}
                    disabled={excluindo}
                    variant="contained"
                    sx={{ bgcolor: LARANJA, "&:hover": { bgcolor: "#d67a4c" } }}
                >
                    {excluindo ? "Excluindo..." : "Excluir"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
