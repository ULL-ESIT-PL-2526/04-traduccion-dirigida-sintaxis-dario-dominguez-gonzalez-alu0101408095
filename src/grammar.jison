/* Lexer */
%lex
%%
\s+                                   { /* skip whitespace */ }
"//"[^\n]*                            { /* skip single line comments */ }
[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?   { return 'NUMBER'; }
"**"                                  { return 'OPOW'; } 
[*/]                                  { return 'OPMU'; } 
[+-]                                  { return 'OPAD'; } 
"("                                   { return '('; }    
")"                                   { return ')'; }    
<<EOF>>                               { return 'EOF'; }
.                                     { return 'INVALID'; }
/lex

/* Parser */
%start expressions
%token NUMBER OPAD OPMU OPOW
%%

expressions
    : E EOF { return $1; }
    ;

// Sumas y Restas (Asociativos por la izquierda)
E
    : E OPAD T { $$ = operate($2, $1, $3); }
    | T        { $$ = $1; }
    ;

// Multiplicación y División (Asociativos por la izquierda)
T
    : T OPMU R { $$ = operate($2, $1, $3); }
    | R        { $$ = $1; }
    ;

// Potencia (Asociativo por la DERECHA)
R
    : F OPOW R { $$ = operate($2, $1, $3); }
    | F        { $$ = $1; }
    ;

// Paréntesis
F
    : NUMBER   { $$ = Number(yytext); }
    | "(" E ")" { $$ = $2; }
    ;
%%

function operate(op, left, right) {
    switch (op) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        case '**': return Math.pow(left, right);
    }
}
