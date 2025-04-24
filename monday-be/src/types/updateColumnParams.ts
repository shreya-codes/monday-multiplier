interface InputChangeProps {
    boardId: string;
    pulseId: string;
    value: {
        value: string;
      };
}

interface OutputChangeProps {
    boardId: string;
    pulseId: string;
    value: {
        value: string;
    };
}

export { InputChangeProps, OutputChangeProps };