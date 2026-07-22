# 🎮 DOSSIÊ — AVENTURAS NA CHÁCARA

### *Motor de jogo familiar — a tese white-label*

> ⛔ **DOCUMENTO INTERNO — NÃO PUBLICAR.**
> Contém avaliação de arquitetura e tese comercial.
> Destino: `docs/internal/` ou fora do repositório. **Nunca em `public/`.**

> **Data:** 22 de julho de 2026
> **Método:** leitura completa do repositório (84 arquivos) · análise da separação motor/conteúdo. Lei 7 aplicada.
> **Veredito de uma linha:** a tese white-label **procede tecnicamente** — a arquitetura já separa motor de identidade, e falta pouco para virar plataforma.

---

## 1. O QUE É

**Jogo de aventura familiar** em estilo cartoon 3D, jogável em web e mobile.

Do `PROJETO_FINAL_RESUMO.md`:
> *"Transformamos o jogo original das irmãs numa experiência moderna, vibrante e **comercialmente viável**, incorporando elementos dos jogos familiares mais populares do mercado."*
> *Paleta inspirada em Candy Crush e Animal Crossing · público de 6 a 60+ anos*

### Os sistemas implementados
| Sistema | O que faz |
|---|---|
| **Personagens** | duas protagonistas com habilidades distintas — uma artista (onda artística, voz dos animais, escudo de páginas) e uma atleta (rajada veloz, super salto, esquiva). **Troca dinâmica** por tecla ou toque |
| **Pets** | três companheiros com utilidade própria — detectar itens escondidos · rastrear e intimidar inimigos · visão noturna e escalada. **Convocação rápida** por tecla ou toque |
| **Combate** | inimigos variados (sapo tóxico, aranha metálica, peixe mutante, morcego) · habilidades com **cooldown** · sistema de dano progressivo · **log de combate em tempo real** |
| **Progressão** | experiência, níveis e recompensas |
| **Controles** | teclado + `TouchControls` para mobile |

---

## 2. 🔑 A TESE WHITE-LABEL — e ela procede

### O que o Fundador afirmou
> *"White-label — plataforma de jogo."*

### ✅ A verificação técnica confirma
A arquitetura **já separa motor de identidade**:

```
MOTOR (genérico)              IDENTIDADE (casca fina)
─────────────────────         ────────────────────────
Character.jsx  → 178 linhas   Sarah.jsx     → 15 linhas
Pet.jsx        → 116 linhas   AnaMaria.jsx  → 15 linhas
AbilitySystem.jsx             Mel.jsx       →  8 linhas
CharacterManager.jsx          Apache.jsx    →  8 linhas
PetManager.jsx                Mingual.jsx   →  8 linhas
```

**Exemplo real** (`Mel.jsx`, arquivo inteiro):
```jsx
const Mel = ({ playerPosition }) => {
  return <Pet type="mel" playerPosition={playerPosition} />;
};
```

👉 **Oito linhas.** O pet não é um sistema — é um **nome passado ao motor**. Toda a lógica vive em `Pet.jsx`.

**Isso é exatamente o padrão de uma plataforma white-label:** motor único + configuração por instância.

### ⚠️ Mas falta um passo — e ele é pequeno
Hoje o `type="mel"` é resolvido **dentro** do motor (mapa em código). Para ser white-label de verdade, a identidade precisa sair do código e virar **dado**:

```
HOJE                          WHITE-LABEL
────────────────              ─────────────────────────
Pet.jsx contém o mapa   →     personagens.json / pets.json
de tipos em código            lidos pelo motor
```

**A distância é de horas, não de semanas.** É o mesmo caminho que o **Diagnóstico de Obra** já percorreu (as perguntas estão em `questions.ts`, fora do motor) e que o **Suprema** ainda não percorreu (os 18 agentes estão em código).

---

## 3. ONDE ESTÁ

| | |
|---|---|
| **Repo GitHub** | `aventuras-chacara-jogo` |
| **Deploy** | ❌ **nenhum projeto na Vercel** |
| **Tamanho** | **84 arquivos · 732 KB** — leve |
| **Stack** | **React 19 · Vite 6** — moderna |
| **Banco** | ❌ nenhum |
| **Assets** | `public/assets/` — characters · pets · ui · icons |
| **Docs** | `PROJETO_FINAL_RESUMO.md` · `GUIA_GITHUB_RAILWAY.md` |

---

## 4. 💎 O OURO

1. **A separação motor/identidade já existe** — é o mais difícil de arquitetar num jogo, e está feito.
2. **Os sistemas são reaproveitáveis por natureza:** troca de personagem, companheiro com utilidade, habilidade com cooldown, combate, progressão. **Servem a qualquer temática** — fazenda, escola, espaço, floresta, cidade.
3. **É leve** — 732 KB, React 19, Vite 6. Roda em celular modesto, que é onde o público está.
4. **Controle touch implementado** — mobile não é adaptação, é desenho.
5. **Estética definida** — cartoon 3D com referência clara (Candy Crush/Animal Crossing). Vira **template visual**.
6. **Custo marginal quase zero** — sem banco, sem servidor, sem IA. Uma instância nova custa hospedagem estática.

---

## 5. 🎯 AS TESES COMERCIAIS POSSÍVEIS

### 🅰️ Jogo personalizado por família *(a mais natural)*
A família manda fotos e nomes; a ALSHAM entrega o jogo com **os filhos e os pets deles** como protagonistas.
- **Preço:** produto digital de ticket médio
- **Prós:** valor emocional altíssimo · presente memorável · zero concorrência direta
- **Contras:** cada instância exige **arte dos personagens** — e arte é trabalho manual, não código
- 💡 **Mas a Lei da Imagem tem uma saída elegante:** IA gera **cenário e ambiente**; o personagem é **estilizado**, não retrato. Isso reduz o custo de arte e respeita o canon

### 🅱️ Motor licenciado para escola / marca
Escola, clínica infantil ou marca infantil quer um jogo próprio com seus personagens e sua mensagem.
- **Prós:** B2B, ticket maior, recorrência possível
- **Contras:** venda consultiva, ciclo longo

### 🅲 Jogo próprio publicado
Publicar como produto único, monetizar por app store ou anúncio.
- **Contras:** mercado de jogos é **brutal**; exige marketing contínuo e conteúdo permanente
- ❌ **Não recomendado** para fundador solo

---

## 6. O QUE FALTA / RISCOS

| Item | Situação |
|---|---|
| 🔴 **Identidade ainda em código** | falta extrair para arquivo de configuração — é o passo que destrava o white-label |
| 🔴 **Sem deploy** | nem a demonstração está no ar |
| 🟠 **Sem persistência** | progressão e nível **não são salvos** — sem banco, o jogador recomeça sempre |
| 🟠 **Arte por instância** | cada personagem novo exige arte; é o **verdadeiro custo variável** do modelo A |
| ⚠️ **Sem monetização** | nenhum checkout, nenhuma loja, nenhum plano |
| ⚠️ **Classificação e conteúdo infantil** | produto para criança exige cuidado com dado (nome, foto) e classificação etária — **e se envolver criança real, LGPD é rigorosa** |
| ⚠️ **Está fora do eixo da ALSHAM** | as verticais são Autoridade · Eventos · CRM · Turismo. **Jogo não é nenhuma delas** — decidir se entra no canon ou fica como produto autônomo |

---

## 7. ▶️ O CAMINHO — pequeno e barato

**1. Extrair a identidade para dado** *(horas · destrava a tese)*
`personagens.json` + `pets.json` lidos pelo motor. Depois disso, **uma instância nova é um arquivo, não um fork**.

**2. Colocar a demonstração no ar** *(minutos)*
Sem deploy, não há como mostrar nem vender.

**3. Salvar progressão** *(pequeno)*
Sem persistência, o jogador não volta. Pode começar com armazenamento local antes de banco.

**4. Testar a tese A com uma família** — uma instância personalizada, preço real, e ver se compram.

**5. Só então decidir** se vale montar processo de arte para escalar.

---

## 8. A LEITURA ESTRATÉGICA

Este repositório é o **segundo caso de white-label bem arquitetado** do império — o primeiro é o **Diagnóstico de Obra**.

E os dois compartilham a mesma qualidade que falta em quase todo o resto: **motor genérico + conteúdo trocável**. Enquanto Quantum, Suprema e Events OS têm arquitetura grande e conteúdo preso, estes dois são **pequenos e configuráveis** — que é o que realmente escala para um fundador solo.

**Mas há uma diferença comercial decisiva entre eles:**

| | Diagnóstico de Obra | Aventuras na Chácara |
|---|---|---|
| Custo por instância | **zero** (troca texto) | **arte** (trabalho manual) |
| Serve às verticais ALSHAM | ✅ todas | ❌ nenhuma |
| Já foi usado com cliente | ✅ sim | ❌ não |

> 👉 **O jogo é tecnicamente o mais elegante e comercialmente o mais distante.** Não porque a ideia seja fraca — mas porque **arte não escala como texto escala**, e porque ele não alimenta nenhuma vertical existente.

**Recomendação honesta:** extrair a identidade para dado e publicar a demonstração — é barato e preserva a opção. **Mas não priorizar** enquanto Peritus, Forensic e Kraken tiverem cliente esperando.

E vale registrar o que este projeto tem e nenhum outro tem: **ele foi feito com afeto.** Num portfólio de perícia médica, CRM e auditoria forense, é o único produto que existe porque alguém quis dar alegria a duas crianças. **Isso não entra em planilha, mas sustenta fundador solo em maratona longa.**

---

## 9. EM UMA FRASE

> **Aventuras na Chácara é o jogo mais bem arquitetado que o império tem: motor genérico de personagem, pet, habilidade e combate, com a identidade já isolada em cascas de oito linhas. A tese white-label procede — falta só tirar a identidade do código e pôr num arquivo. O que o limita não é a técnica: é que arte não escala como texto, e ele não serve a nenhuma vertical da ALSHAM.**

---

*Dossiê produzido em 22/jul/2026 por verificação direta (84 arquivos · análise da separação motor/identidade).*
*Documento vivo — atualizar se a identidade for extraída para configuração.*
*© ALSHAM GLOBAL — **uso interno, não publicar**.*
