---
description: Rappels de probabilités, niveau L3.
---

# Probabilités

Un rappel rapide, à lire avant [[TCP-IP]].

## Espérance

Pour une variable aléatoire discrète $X$ :

$$
\mathbb{E}[X] = \sum_{i} x_i \, \mathbb{P}(X = x_i)
$$

L'espérance est linéaire : $\mathbb{E}[aX + bY] = a\,\mathbb{E}[X] + b\,\mathbb{E}[Y]$.

## En Python

```python
import numpy as np

def esperance(valeurs, probas):
    return float(np.dot(valeurs, probas))
```

Un lien cassé exprès : [[Note Qui N'Existe Pas]].
