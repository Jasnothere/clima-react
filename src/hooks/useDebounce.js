export const useDebounce = (valor, ms) => {
    return setTimeout(()=>{
        return valor;
    }, ms);
}