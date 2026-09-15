# Probability model 
Before beginning anything we need to state a clear and well posed model, we are going to define 3 elements : 
- A **Sample Space**
- A **Class of Events**
- A **Probability Measure**
We can first define these elements with a general definition but we then need to further precise the definition in order to make sure that they form a firm mathematical model. 
---
## Sample space 
A Sample space $\Omega$ is defined as a collection of elements $\omega$, we called these elements *outcomes*.

*Exemples* : 
- The most famous one is to throw a die. We have a Sample space composed of all the outcomes possible : $$ \begin{gathered} \Omega = \{1, 2, 3, 4, 5, 6\}  \end{gathered} $$
- There is also the exemple about shuffling a deck of card : $$|\Omega| = 52!$$ As we have 52 possibilities of outcomes
---
## Class of Events 
A **Class of Events** $\mathcal{F}$ can be not formally defined as the class of all subset of the **Sample space** but we need to further precise this definition. In reality we need this class of events to obey to the **Axioms of probabilities**. 

We must have that : 
- $\Omega$ is an event 
- For any sequence of event $A_1, A_2, A_3,...,A_n$ we must have that $\bigcup_{i=1}^{n} A_i$ is an event
- If $A$ is an event then $A^{c}$[^1] is an event. 

Some class of events that satisfy these three properties are designed as $\sigma$ algebra.
Particular case : 
**Borel Sigma algebra** : The smallest sigma algebra containing all open subset of $\mathbb{R}$. 
### Independence of Event 

We will say that two event are independent if : 
$$P(A \vert B) = P(A)\times P(B)$$

---
## A probability measure
A **Probability Measure** on a sample space $\Omega$, associated with a $\sigma$ algebra is a probability rule that act as a function mapping each $A \in\Omega$ to a non negative number. We must have the following : 
- $P(\Omega) = 1$ 
- Given an event $A$, we must have that $P(A) \leq 1$ 
- For a collection of disjoint $A_1, A_2, A_3, ..., A_n$ events we must have that : 
$$ P(\cup_{i=1}^{n} A_i) = \sum_{i=1}^{n} P(A_i) $$
*Corollary* : 
- $P(A) \geq 0$
- For $A \subseteq B$ we have $P(A) \leq P(B)$
- $P(A\cup B) = P(A) + P(B) + P(A \cap B)$
- For a collection of disjoints events $ P(\cap_{i=1}^{n} A_i) = \prod_{i=1}^{n} P(A_i)$
- $P(A) = 1 - P(A^c)$

---
## Probability space/model 
A probability space is a triplet $(\Omega , \mathcal{F} , P)$, where $\Omega$ is a sample space, $\mathcal{F}$ is a $\sigma$-algebra on $\Omega$ and $P$ is a probability measure satisfying the axiom of probability on $\mathcal{F}$. 

*Exemple* : 
- Discrete Probability model : 
	- $\Omega = {\omega_1, \omega_2, \omega_3, ... }$ is a finite set
	- $P(\omega_i) \leq 1$ $\forall i$ 
	- $\sum_{i=1}^{\inf} P(\omega_i) = 1$
- Continuous probability space : 
	- $\Omega = \mathbb{R}$
	- $\mathcal{F} =$ Borel sigma algebra
	- For $A \in \mathcal{F}$ we have $P(A) = \int_{A} f(x)dx$ where $f(x)$ is the *probability density function* [^4]
	
---
## Bayes law

$$ P(A\vert B) = \frac{P(A \cap B)}{P(B)}$$

---

## Random Variable 

Here we will first give the intuitive notion of random variable and then pursue with the formal definition of it. 

In practice outcomes can be of all form for instance they can be : $\omega_1=$ Day, $w_2 =$ Night
So we can see a r.v as simply a function mapping each outcomes $\omega$ to a number $X(\omega)$. 

Formally : Let $(\Omega , \mathcal{F} , P)$ be a probability space, a function $X^n : \Omega \rightarrow \mathbb{R} : \omega \rightarrow [0,+\inf$] is called a $n$-dimensional random variable if for $A \in \mathcal{B}, X^{-1}(A) \in \mathcal{F}$ [^5]

We can make the distinction between discrete and continuous random variable by the fact that the first will take discrete value where the second will only take continuous value. 

---
## PDF, CDF, PMF

The **Cumulative density function** of a $1$-dimensional continuous random variable is defined as follow : 
$$F_{X}(x) = P(X \leq x) = \{\omega \in \Omega : X(\omega) \leq x\}$$Property : 
- It is an increasing function of $x$
- $\lim_{x\rightarrow 0} F_{X}(x) = 0$
- $\lim_{x\rightarrow \inf} F_{X}(x) = 1$
- $F_{X}^{c}(x) = 1 - F_{X}(x)$

If this function has a derivative correctly defined then we call it the **Probability density function** and is given by $$f_{X}(x) = \frac{d f_{X}(x)}{dx}$$
In the case of a discrete random variable we can define the **Probability mass function** as follow : 
$$p_{X}(x) = P(X = x) = P(\{\omega \in \Omega : X(\omega) = x\})$$
Property : 
- $p_{X}(x) \geq 0$, and $p_{X}(x) = 0$ outside of the (countable) set of values taken by $X$
- $\sum_{i} p_{X}(x_i) = 1$
- $F_{X}(x) = \sum_{x_i \leq x} p_{X}(x_i)$ : the CDF is a staircase function whose jump at $x$ is exactly $p_{X}(x)$

---
## Expectation 

The expectation is the "center of mass" of the law of $X$ : the value taken by $X$, averaged over $\Omega$ and weighted by the probability of each outcome. 

For a discrete random variable : 
$$\mathbb{E}[X] = \sum_{i} x_i \, p_{X}(x_i)$$
For a continuous random variable : 
$$\mathbb{E}[X] = \int_{-\infty}^{+\infty} x \, f_{X}(x) \, dx$$
Both are in fact the same object, the integral of $X$ against the probability measure of the model : 
$$\mathbb{E}[X] = \int_{\Omega} X(\omega) \, dP(\omega)$$
The expectation is well defined and finite if and only if $\mathbb{E}[\vert X \vert] < \infty$, we then say that $X$ is *integrable* and write $X \in L^1$. This is not automatic : the Cauchy law $f_{X}(x) = \frac{1}{\pi (1+x^2)}$ has no expectation at all. 

**Transfer theorem** [^6] : for a measurable function $g$ we do not need the law of $g(X)$, the law of $X$ is enough : 
$$\mathbb{E}[g(X)] = \sum_{i} g(x_i) \, p_{X}(x_i) \qquad \mathbb{E}[g(X)] = \int_{-\infty}^{+\infty} g(x) f_{X}(x) \, dx$$

Property : 
- *Linearity* : $\mathbb{E}[aX + bY] = a\mathbb{E}[X] + b\mathbb{E}[Y]$. This holds **always**, even when $X$ and $Y$ are not independent 
- $\mathbb{E}[c] = c$ for a constant $c$ 
- *Monotonicity* : if $X \leq Y$ almost surely then $\mathbb{E}[X] \leq \mathbb{E}[Y]$, and $\vert \mathbb{E}[X] \vert \leq \mathbb{E}[\vert X \vert]$ 
- If $X$ and $Y$ are independent and integrable : $\mathbb{E}[XY] = \mathbb{E}[X] \, \mathbb{E}[Y]$. The converse is false 
- Indicator : $\mathbb{E}[\mathbf{1}_{A}] = P(A)$, which is the bridge between the measure $P$ and the expectation 
- Tail formula : for $X \geq 0$, $\mathbb{E}[X] = \int_{0}^{+\infty} P(X > x) \, dx$, and $\mathbb{E}[X] = \sum_{n \geq 1} P(X \geq n)$ if $X$ is $\mathbb{N}$-valued 

The **moment of order $k$** is $m_k = \mathbb{E}[X^{k}]$ and the **central moment of order $k$** is $\mathbb{E}[(X - \mathbb{E}[X])^{k}]$. 

**Markov inequality** : for $X \geq 0$ and $a > 0$, 
$$P(X \geq a) \leq \frac{\mathbb{E}[X]}{a}$$

---
## Variance 

The expectation alone says nothing about the dispersion of $X$ around it, this is what the variance measures : 
$$\mathrm{Var}(X) = \mathbb{E}\big[(X - \mathbb{E}[X])^{2}\big] = \mathbb{E}[X^{2}] - \big(\mathbb{E}[X]\big)^{2}$$
It is finite if and only if $X \in L^2$, i.e. $\mathbb{E}[X^2] < \infty$. The **standard deviation** $\sigma_{X} = \sqrt{\mathrm{Var}(X)}$ is homogeneous to $X$, which is why we usually report it rather than the variance. 

Property : 
- $\mathrm{Var}(X) \geq 0$, with equality if and only if $X$ is constant almost surely 
- $\mathrm{Var}(aX + b) = a^{2} \mathrm{Var}(X)$ : the variance is **not** linear, and it is invariant by translation 
- **Covariance** : $\mathrm{Cov}(X,Y) = \mathbb{E}[(X - \mathbb{E}[X])(Y - \mathbb{E}[Y])] = \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y]$, so $\mathrm{Var}(X) = \mathrm{Cov}(X,X)$ 
- $\mathrm{Var}(X + Y) = \mathrm{Var}(X) + \mathrm{Var}(Y) + 2\,\mathrm{Cov}(X,Y)$ 
- If $X$ and $Y$ are independent then $\mathrm{Cov}(X,Y) = 0$ and the variance becomes additive. Uncorrelated does *not* imply independent 
- More generally, for pairwise uncorrelated $X_1, ..., X_n$ : $\mathrm{Var}(\sum_{i=1}^{n} X_i) = \sum_{i=1}^{n} \mathrm{Var}(X_i)$ 
- **Correlation coefficient** : $\rho(X,Y) = \frac{\mathrm{Cov}(X,Y)}{\sigma_{X} \sigma_{Y}} \in [-1,1]$ 

**Chebyshev inequality** : applying Markov to $(X - \mu)^{2}$ with $\mu = \mathbb{E}[X]$ gives, for $\varepsilon > 0$, 
$$P(\vert X - \mu \vert \geq \varepsilon) \leq \frac{\mathrm{Var}(X)}{\varepsilon^{2}}$$
This is the inequality that turns "small variance" into "concentration around the mean", and it is the engine of the weak law of large numbers. 

*Exemple* : let $X_1, ..., X_n$ be i.i.d. [^7] with mean $\mu$ and variance $\sigma^{2}$, and $\bar{X}_n = \frac{1}{n}\sum_{i=1}^{n} X_i$ the empirical mean. Then 
$$\mathbb{E}[\bar{X}_n] = \mu \qquad \mathrm{Var}(\bar{X}_n) = \frac{\sigma^{2}}{n}$$
The mean is unchanged but the dispersion shrinks like $1/n$ : the empirical mean concentrates. 

---
## Characteristic function 

The characteristic function of a random variable $X$ is the Fourier transform of its law : 
$$\varphi_{X}(t) = \mathbb{E}[e^{itX}] = \int_{-\infty}^{+\infty} e^{itx} f_{X}(x) \, dx \qquad t \in \mathbb{R}$$
Contrary to the moment generating function $\mathbb{E}[e^{tX}]$, it is defined for **every** law and every $t$, since $\vert e^{itX} \vert = 1$ is bounded hence integrable. 

Property : 
- $\varphi_{X}(0) = 1$, $\vert \varphi_{X}(t) \vert \leq 1$ and $\varphi_{X}$ is uniformly continuous on $\mathbb{R}$ 
- $\varphi_{X}(-t) = \overline{\varphi_{X}(t)}$, and $\varphi_{X}$ is real valued if and only if $X$ is symmetric 
- $\varphi_{aX + b}(t) = e^{itb} \varphi_{X}(at)$ 
- If $X$ and $Y$ are independent : $\varphi_{X+Y}(t) = \varphi_{X}(t)\,\varphi_{Y}(t)$. A convolution of densities becomes a simple product, which is the main computational reason to use $\varphi$ 
- *Moments* : if $\mathbb{E}[\vert X \vert^{k}] < \infty$ then $\varphi_{X}$ is $k$ times differentiable and $\varphi_{X}^{(k)}(0) = i^{k}\,\mathbb{E}[X^{k}]$, so that 
$$\varphi_{X}(t) = 1 + it\,\mathbb{E}[X] - \frac{t^{2}}{2}\mathbb{E}[X^{2}] + o(t^{2})$$
- **Uniqueness theorem** : $\varphi_{X}$ characterizes the law of $X$ entirely. If $\varphi_{X} = \varphi_{Y}$ then $X$ and $Y$ have the same law, and the density can be recovered by the inversion formula $f_{X}(x) = \frac{1}{2\pi}\int_{-\infty}^{+\infty} e^{-itx}\varphi_{X}(t)\,dt$ when $\varphi_X$ is integrable 
- **Lévy continuity theorem** : $X_n \xrightarrow{d} X$ if and only if $\varphi_{X_n}(t) \rightarrow \varphi_{X}(t)$ for every $t$, the limit being continuous at $0$. This is what makes the proof of the central limit theorem possible 

Usual characteristic functions : 

| Law | $\varphi_{X}(t)$ |
| --- | --- |
| Bernoulli $\mathcal{B}(p)$ | $1 - p + p e^{it}$ |
| Binomial $\mathcal{B}(n,p)$ | $(1 - p + p e^{it})^{n}$ |
| Poisson $\mathcal{P}(\lambda)$ | $e^{\lambda (e^{it} - 1)}$ |
| Exponential $\mathcal{E}(\lambda)$ | $\frac{\lambda}{\lambda - it}$ |
| Normal $\mathcal{N}(\mu, \sigma^{2})$ | $e^{i\mu t - \frac{1}{2}\sigma^{2}t^{2}}$ |

---
## Modes of convergence 

Before stating the two limit theorems we need to say in *which sense* a sequence of random variables converges, because the law of large numbers and the central limit theorem do not use the same one. 

- *Almost sure* : $X_n \overset{a.s.}{\longrightarrow} X$ if $P(\{\omega : X_n(\omega) \rightarrow X(\omega)\}) = 1$, i.e. almost every trajectory converges 
- *In probability* : $X_n \xrightarrow{P} X$ if $\forall \varepsilon > 0$, $P(\vert X_n - X \vert \geq \varepsilon) \rightarrow 0$ 
- *In $L^{p}$* : $\mathbb{E}[\vert X_n - X \vert^{p}] \rightarrow 0$ 
- *In distribution* : $X_n \xrightarrow{d} X$ if $F_{X_n}(x) \rightarrow F_{X}(x)$ at every continuity point $x$ of $F_{X}$. Here only the laws converge, the random variables need not even live on the same probability space 

The implications are strict and go only one way : 
$$a.s. \Longrightarrow \text{in probability} \Longrightarrow \text{in distribution} \qquad L^{p} \Longrightarrow \text{in probability}$$

---
## Law of large numbers 

Let $X_1, X_2, ...$ be i.i.d. and integrable, with $\mathbb{E}[X_1] = \mu$. Write $S_n = \sum_{i=1}^{n} X_i$ and $\bar{X}_n = \frac{S_n}{n}$. 

**Weak law (Khinchin)** : the empirical mean converges to $\mu$ *in probability* : 
$$\bar{X}_n \xrightarrow{P} \mu \qquad \text{i.e.} \quad \forall \varepsilon > 0, \quad P(\vert \bar{X}_n - \mu \vert \geq \varepsilon) \xrightarrow[n \to \infty]{} 0$$
*Proof when $\sigma^{2} = \mathrm{Var}(X_1) < \infty$* : we saw that $\mathbb{E}[\bar{X}_n] = \mu$ and $\mathrm{Var}(\bar{X}_n) = \sigma^{2}/n$, so Chebyshev gives directly 
$$P(\vert \bar{X}_n - \mu \vert \geq \varepsilon) \leq \frac{\sigma^{2}}{n \varepsilon^{2}} \xrightarrow[n \to \infty]{} 0$$
Under the sole assumption $\mathbb{E}[\vert X_1 \vert] < \infty$ the result still holds, but the proof needs a truncation argument or the characteristic function. 

**Strong law (Kolmogorov)** : under the same assumption $\mathbb{E}[\vert X_1 \vert] < \infty$, the convergence is in fact *almost sure* : 
$$\bar{X}_n \overset{a.s.}{\longrightarrow} \mu \qquad \text{i.e.} \quad P\Big(\lim_{n \to \infty} \bar{X}_n = \mu\Big) = 1$$
The condition is sharp : if $\mathbb{E}[\vert X_1 \vert] = \infty$ then $\limsup_n \vert \bar{X}_n \vert = +\infty$ almost surely. 

*Weak versus strong* : the weak law is a statement about each fixed $n$ separately — for $n$ large, the probability of being far from $\mu$ is small, but nothing forbids the "bad" event to happen again infinitely often. The strong law says that almost every single trajectory $\omega$ enters a neighbourhood of $\mu$ and stays there forever. Almost sure convergence implies convergence in probability, so the strong law implies the weak one. 

*Exemple* : with $X_i \sim \mathcal{B}(p)$, $\bar{X}_n$ is the observed frequency of successes and it converges to $p$. This is what justifies the frequentist reading of a probability, and what makes Monte Carlo estimation work. 

---
## Central limit theorem 

The law of large numbers says that $\bar{X}_n \rightarrow \mu$, but says nothing about the *size* and the *shape* of the error $\bar{X}_n - \mu$. The central limit theorem answers both : the error is of order $1/\sqrt{n}$ and, once rescaled by $\sqrt{n}$, it is Gaussian. 

Let $X_1, X_2, ...$ be i.i.d. with $\mathbb{E}[X_1] = \mu$ and $0 < \sigma^{2} = \mathrm{Var}(X_1) < \infty$. Then : 
$$\frac{S_n - n\mu}{\sigma \sqrt{n}} = \sqrt{n}\,\frac{\bar{X}_n - \mu}{\sigma} \xrightarrow{d} \mathcal{N}(0,1)$$
that is, for every $x \in \mathbb{R}$ : 
$$P\left(\frac{S_n - n\mu}{\sigma\sqrt{n}} \leq x\right) \xrightarrow[n \to \infty]{} \Phi(x) = \int_{-\infty}^{x} \frac{1}{\sqrt{2\pi}} e^{-u^{2}/2} \, du$$

*Proof with characteristic functions* : set $Y_i = \frac{X_i - \mu}{\sigma}$, which is centered and reduced, and $Z_n = \frac{1}{\sqrt{n}}\sum_{i=1}^{n} Y_i$. Since $\mathbb{E}[Y_1] = 0$ and $\mathbb{E}[Y_1^{2}] = 1$, the moment expansion gives $\varphi_{Y}(t) = 1 - \frac{t^{2}}{2} + o(t^{2})$. The $Y_i$ being independent, the product property gives 
$$\varphi_{Z_n}(t) = \left[\varphi_{Y}\!\left(\frac{t}{\sqrt{n}}\right)\right]^{n} = \left(1 - \frac{t^{2}}{2n} + o\!\left(\frac{1}{n}\right)\right)^{n} \xrightarrow[n \to \infty]{} e^{-t^{2}/2}$$
which is the characteristic function of $\mathcal{N}(0,1)$, and we conclude with the Lévy continuity theorem. 

Remarks : 
- Nothing is assumed on the law of the $X_i$ beyond being i.i.d. with a finite variance : this universality is why the Gaussian appears everywhere 
- *Speed of convergence* — Berry–Esseen : if $\rho = \mathbb{E}[\vert X_1 - \mu \vert^{3}] < \infty$ then $\sup_{x} \vert F_{Z_n}(x) - \Phi(x) \vert \leq \frac{C \rho}{\sigma^{3}\sqrt{n}}$, the error decreasing like $1/\sqrt{n}$ 
- The de Moivre–Laplace theorem is the particular case $X_i \sim \mathcal{B}(p)$ : $\mathcal{B}(n,p) \approx \mathcal{N}(np, np(1-p))$ for $n$ large 
- Practical use : an asymptotic confidence interval at $95\%$ for $\mu$ is $\bar{X}_n \pm 1.96 \frac{\sigma}{\sqrt{n}}$ 
- The finite variance hypothesis is essential. Without it the limit is no longer Gaussian but a stable law, e.g. the empirical mean of Cauchy variables is again Cauchy and does not converge at all 

## Comparaison 

We have that :$$P(X>Y) = \sum_i P(X>y_i \vert Y =y_i) \times P(Y = y_i)$$
And also that : $$P(X>Y) = \int_y P(X>y \vert Y =y) \times P(Y = y)$$ 

---

*Exercice* : [[Exercices Probability]] 

# Combinatorial 

Here we will detail some of the formula with their sens, first we have, that for a sequence $S$, if there is $n_1$ first element, $n_2$ second elements ect we have :
$$n_1 \times n_2 \times n_3 \times ...$$ possible outcomes. 
### Permutation 
Here the **order is essential**, to obtain how much combinaison of different symbols in a sequence $S$ we have the formula 
$$\frac{n!}{n_1!n_2!...n_k!}$$
Exemple : 
For $\{A,B,C\}$ we have : $\frac{3!}{1!\times 1! \times 1!} = 6$ way of arranging the sequence

### Combination 
Here the order does not mater, we only want to know **How many way can we arrange $r$ elements in a sequence $n$**
Exemple : 
For a deck of card, we can compute the number of subset of 5 car in the following way : $$\binom{n}{r} = \frac{n!}{r! (n-r)!}$$
*Exercice* : See [[Exercices Probability]]


[^1]: Here $A^{c}$ design the complementary of $A$ in the sens that is specified here 

[^4]: See later

[^5]:  Here $X^{-1}(A)$ design all outcomes $\omega$ such that their image by $X$ gives us $A$

[^6]: Also called the *law of the unconscious statistician* 

[^7]: *Independent and identically distributed* : the $X_i$ are mutually independent and all follow the same law 
